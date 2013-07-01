# git reset --hard v2.38
cd ../codemirror
bin/compress codemirror --local uglifyjs javascript.js xml.js htmlmixed.js > ../paperjs.org/assets/js/codemirror.js
cd ../paperjs.org