#!/bin/bash
#
# Commit the site that Woods exported to ../paperjs.github.io and push it, with
# the message and the tag of the source commit. Runs on GitHub Actions, after
# `npm run build`.

set -e

MESSAGE=$(git log -1 --format=%B)
# Find the tag of the source commit, if any. Annotated tags are listed with
# their peeled commit as refs/tags/<tag>^{}:
TAG=$(git ls-remote --tags origin | awk -v sha="$GITHUB_SHA" \
	'$1 == sha { sub("refs/tags/", "", $2); sub("\\^\\{\\}", "", $2); print $2 }')

cd ../paperjs.github.io

git config user.name "Paper.js Bot"
git config user.email "bot@paperjs.org"

# Keep the Sass sources out of the published site.
echo "bourbon
mixins
style
*.scss" > assets/css/.gitignore

echo "paperjs.org" > CNAME

git add --all
# Changes that don't affect the exported site leave nothing to commit.
if ! git diff --cached --quiet; then
	git commit -m "$MESSAGE"
fi
git push origin main

# Tag the release, unless a previous run already did:
if [ -n "$TAG" ] && ! git ls-remote --exit-code --tags origin "refs/tags/$TAG" > /dev/null; then
	git tag "$TAG" -m "$MESSAGE"
	git push origin "$TAG"
fi
