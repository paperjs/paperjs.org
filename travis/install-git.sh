#!/bin/bash

BASE_DIR="$(dirname "$TRAVIS_BUILD_DIR")"

function setup_git()
{
	if [ "$(ls -A $1)" ]; then
		cd $1
		git checkout master
		git fetch --all
		git reset --hard origin/master
		git clean -f -d
		cd ..
	else
		git clone "https://github.com/paperjs/$1"
	fi
}

cd $BASE_DIR
setup_git "paper.js"
setup_git "paperjs.github.io"
