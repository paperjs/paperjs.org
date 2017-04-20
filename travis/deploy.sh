#!/bin/bash

BASE_DIR="$(dirname "$TRAVIS_BUILD_DIR")"

cd $BASE_DIR/paperjs.github.io

echo "bourbon
mixins
style
*.scss" > assets/css/.gitignore

echo "paperjs.org" > CNAME

git add --all *
git commit -m "$TRAVIS_COMMIT_MESSAGE"

if [ -n "$TRAVIS_TAG" ]; then
	git tag "$TRAVIS_TAG" -m "$TRAVIS_COMMIT_MESSAGE"
fi

git push origin master --tags
