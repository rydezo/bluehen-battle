#!/bin/sh
# This script builds the documentation for the project using mkdocs

# Fail script if a command fails
set -e

# ---------------- Functions -------------
NEED_APT_UPDATE=1
install_package() {
    LOGICAL_NAME=$1
    APT_PKG=${2:-$LOGICAL_NAME}
    YUM_PKG=${3:-$LOGICAL_NAME}
    APK_PKG=${4:-$LOGICAL_NAME}

    echo "Checking for $LOGICAL_NAME..."

    # Check if already installed
    if command -v "$LOGICAL_NAME" >/dev/null 2>&1; then
        echo "$LOGICAL_NAME is already installed."
        return
    fi

    echo "$LOGICAL_NAME not found. Attempting to install..."

    if command -v apt-get >/dev/null 2>&1; then
        if [ "$NEED_APT_UPDATE" -eq 1 ]; then
            sudo apt-get update
            NEED_APT_UPDATE=0
        fi
        sudo apt-get install -y "$APT_PKG"
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y "$YUM_PKG"
    elif command -v apk >/dev/null 2>&1; then
        sudo apk add --no-cache "$APK_PKG"
    else
        echo "Unsupported package manager. Please install $LOGICAL_NAME manually."
        exit 1
    fi
}

# --------------- Args ------------------

# Check that the folder specified in the first argument exists
export SRC=${1:-docs}
if [ -z "${SRC}" ] ; then
    echo "No source folder specified. Please provide a source folder."
    exit 1
fi
# Check if the source folder exists
if [ ! -d "${SRC}" ] ; then
    echo "Source folder ${SRC} does not exist."
    exit 1
fi

# Create output directory from second argument to script, which defaults to dist/docs
export DST=${2:-dist/docs}
mkdir -p "${DST}"
# Check if the destination folder exists
if [ ! -d "${DST}" ] ; then
    echo "Destination folder ${DST} does not exist, after attempting to create it."
    exit 1
fi

# Get the assets/docs folder from the third argument, or default to assets/docs
ASSETS=${3:-assets/docs}
# Check if the assets folder exists
if [ ! -d "${ASSETS}" ] ; then
    echo "Assets folder ${ASSETS} does not exist."
    exit 1
fi
# Check if the assets folder is empty
if [ -z "$(ls -A "${ASSETS}")" ] ; then
    echo "Assets folder ${ASSETS} is empty."
    exit 1
fi

# Temp files
TMP_DST="${4:-_tmp}"
mkdir -p "${TMP_DST}"
# Check if the temporary folder exists
if [ ! -d "${TMP_DST}" ] ; then
    echo "Temporary folder ${TMP_DST} does not exist, after attempting to create it."
    exit 1
fi
echo "Source: ${SRC}; Destination: ${DST}; Temporary: ${TMP_DST}; Assets: ${ASSETS}"

# Ignore safe directory errors
git config --global --add safe.directory '*'

# Configure TITLE
if [ "${HIDE_REPOSITORY}" = "true" ]; then
    echo "Hiding repository location from documentation."
    unset GITHUB_REPOSITORY
fi
export TITLE="${TITLE:-${GITHUB_REPOSITORY:-Documentation}}"

# Check if documentation is from GitHub
if [ ! -z "${GITHUB_SERVER_URL}" -a ! -z "${GITHUB_REPOSITORY}" ] ; then
    export GIT=1
    export REPO_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}"
    EDIT_URI="${SRC#/}"
    case "${GITHUB_REF}" in
        refs/heads/* )
            BRANCH_NAME=${GITHUB_REF#refs/heads/}
    esac
    if [ ! -z "${BRANCH_NAME}" ] ; then
        export EDIT_URI="edit/${BRANCH_NAME}/${EDIT_URI}"
    fi
fi

# ----------------- Dependencies ---------------

# Ensure PlantUML, Java, and Graphviz are available
install_package java openjdk-11-jre-headless java-11-openjdk openjdk8
install_package dot graphviz graphviz graphviz
install_package git git git git
if ! python3 -m venv --help >/dev/null 2>&1; then
    echo "python3-venv not found, attempting to install..."
    install_package python3-venv python3-venv python3-venv py3-venv
fi
# pip3 too
if ! python3 -m pip --help >/dev/null 2>&1; then
    echo "pip3 not found, attempting to install..."
    install_package python3-pip python3-pip python3-pip py3-pip
fi

if ! command -v plantuml >/dev/null 2>&1 ; then
    echo "PlantUML not found, installing locally..."

    LOCAL_TEMP="${TMP_DST}/_temp"
    LOCAL_PLANTUML_DIR="${LOCAL_TEMP}/plantuml"

    mkdir -p "${LOCAL_PLANTUML_DIR}"

    # Check for Java
    if ! command -v java >/dev/null 2>&1 ; then
        echo "Java is required to run PlantUML. Please install Java."
        exit 1
    fi

    # If file does not already exist, then download it
    if [ ! -f "${LOCAL_PLANTUML_DIR}/plantuml.jar" ] ; then
        echo "Downloading PlantUML..."
        # Download plantuml.jar
        wget -q -O "${LOCAL_PLANTUML_DIR}/plantuml.jar" https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar
    else
        echo "PlantUML already downloaded."
    fi
    export PLANTUML_CMD="java -Dplantuml.include.path=${SRC} -jar ${LOCAL_PLANTUML_DIR}/plantuml.jar"
else
    echo "PlantUML found."
    export PLANTUML_CMD="plantuml"
fi

# Ensure Python and pip are available
if ! command -v python3 >/dev/null || ! command -v python3 -m pip >/dev/null ; then
    echo "Python3 and pip3 are required. Please install them."
    exit 1
fi

VENV_DIR="${TMP_DST}/venv"
VENV_HASH=$(sha256sum "${ASSETS}/requirements.txt" | awk '{print $1}')
SHARED_VENV_PARENT="/opt/shared-venvs/${VENV_HASH}"
SHARED_VENV_DIR="${SHARED_VENV_PARENT}/venv"

echo "VENV_HASH=${VENV_HASH}"
echo "Looking for shared venv at: ${SHARED_VENV_DIR}"

# If the shared venv already exists, symlink it
if [ -d "${SHARED_VENV_DIR}" ]; then
    echo "Shared venv found. Creating symlink..."
    mkdir -p "$(dirname "${VENV_DIR}")"
    ln -s "${SHARED_VENV_DIR}" "${VENV_DIR}"
    . "${VENV_DIR}/bin/activate"
else
    echo "Creating virtualenv..."
    python3 -m venv "${VENV_DIR}"
    . "${VENV_DIR}/bin/activate"
    python3 -m pip install --upgrade pip
    python3 -m pip install -r "${ASSETS}/requirements.txt" || { echo "Failed to install requirements."; exit 1; }

    echo "Saving venv to shared location..."
    # Only copy once it’s fully built to avoid corrupted saves
    mkdir -p "${SHARED_VENV_PARENT}"
    cp -r "${VENV_DIR}" "${SHARED_VENV_PARENT}/venv"
fi

# ---------------- MkDocs ----------------

# MkDocs default config
if [ ! -z "${ICON}" ] ; then
    export ICON=material/${ICON##*/}
fi
# Generate index if absent
if [ ! -f "${SRC}/index.md" -a ! -f "${SRC}/README.md" ] ; then
    echo "Index file (index.md) not found. It will be created using a script..."
    echo "# ${TITLE}" > "${SRC}/index.md"
    CLEAN_INDEX=true
fi

# Copy static template files
export SRC_THEME="${SRC}/theme"
echo "SRC_THEME: ${SRC_THEME}"
mkdir -p "${SRC_THEME}"
cp -f "${ASSETS}/theme.main.html" "${SRC_THEME}/main.html"
cp -f "${ASSETS}/theme.404.html" "${SRC_THEME}/404.html"
export SRC_THEME="$(realpath "${SRC_THEME}")"
CLEAN_THEME=true

# Build docs to temp folder
export DOCS_DIR="$(realpath "${SRC}")"
export DST_DIR="$(realpath "${TMP_DST}")/built"
python3 -m mkdocs build -c -f "${ASSETS}/mkdocs.yml" -d "${DST_DIR}"

# -------------------- Cleanup --------------------

# Start cleanup phase
echo "Cleanup..."
# Copy static assets to be added
mkdir -p "${TMP_DST}/built/js" && cp -f "${ASSETS}/arithmatex.config.js" "${TMP_DST}/built/js/arithmatex.config.js"
# Prepare destination
# Safety check to prevent wiping root or dangerous directories
if [ -z "$DST" ] || [ "$DST" = "/" ] || [ "$DST" = "/*" ] || [ "$DST" = "." ] || [ "$DST" = ".." ]; then
    echo "ERROR: Unsafe DST directory: '$DST'. Aborting to prevent accidental deletion."
    exit 1
fi
rm -rf "${DST}"
# Move results to destination
mv -f "${TMP_DST}/built" "${DST}"
# Cleanup
if [ "${CLEAN_INDEX}" = true ] ; then
    rm "${SRC}/index.md"
fi
if [ "${CLEAN_THEME}" = true ] ; then
    rm -rf "${SRC_THEME}"
fi
# End task
echo "Done"