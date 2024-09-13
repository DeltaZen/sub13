const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const filesize = require('filesize');
const CleanCSS = require('clean-css');
const JSZip = require('jszip');
const glob = require('glob');

const raw = path => fs.readFileSync(path, 'utf8');

const rawConcat = fileGlob => glob.sync(fileGlob)
  .sort((a, b) => (a > b) ? 1 : -1)
  .reduce((res, curr) => res + raw(curr) + '\n', '');

const js = fileGlob => {
  // This is a hack to make closure compiler work on my windows machine.
  // Running it programmatically stalls for some reason.
  const compilerPath = path.resolve('.', 'node_modules', 'google-closure-compiler', 'cli.js');
  const jsPath = path.normalize(fileGlob);

  var command = 'node ' + compilerPath;
  command += ' --js \'' + jsPath + '\''
  command += ' --language_in ECMASCRIPT_2018'
  command += ' --language_out ECMASCRIPT_2018'
  command += ' --compilation_level ADVANCED';

  const output = childProcess.execSync(command);
  console.log('JS ✔️');

  return output.toString();
};

const css = path => new Promise(resolve => {
  const compiler = new CleanCSS({ level: { 1: { all: true }, 2: { all: true } } });
  const src = fs.readFileSync(path, 'utf8');

  compiler.minify(src, (err, output) => {
    if (err) throw err;
    console.log('CSS ✔️');
    resolve(output.styles);
  });
});

const expandMarkup = template => ([js, css]) => fs.readFileSync(template, 'utf8')
  .replace('<!--js-->', `<script>${js}</script>`)
  .replace('<!--css-->', `<style>${css}</style>`);

const trimWhitespace = content => content
  .split('\n')
  .map(x => x.trim())
  .join('');

const zipTap = path => content => new Promise(resolve => {
  const zip = new JSZip();
  zip.file('index.html', content);

  zip.generateNodeStream({
    streamFiles: true,
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  })
    .pipe(fs.createWriteStream(path))
    .on('finish', () => {
      // The "finish" event seems to be called slightly before the file is actually available to read.
      // If we want to stat it right after, give it a grace period to finish up.
      setTimeout(() => resolve(content), 200);
    });
});

const fileTap = path => content => {
  fs.writeFileSync(path, content);
  return content;
};

const writeStats = (path, dev) => tap => {
  const stats = fs.statSync(path);
  console.log(`File: ${path}, size: ${filesize(stats.size)} ${dev ? '(not minified)' : ''}`);
  return tap;
};

const compile = () => {
  console.log('Production minification started...');
  Promise.all([js('./src/js/**.js'), css('src/style.css')])
    .then(expandMarkup('./src/html.template'))
    .then(trimWhitespace)
    .then(zipTap('./dist/min.zip'))
    .then(fileTap('./dist/index.html'))
    .then(writeStats('./dist/index.html'))
    .then(writeStats('./dist/min.zip'))
    .catch(err => { throw err });
}

const bundle = () => {
  console.log('\n\nDevelopment bundling started...');
  Promise.all([rawConcat('./src/js/**.js'), raw('src/style.css')])
    .then(expandMarkup('./src/html.template'))
    .then(fileTap('dist/index.html'))
    .then(writeStats('dist/index.html', true))
    .catch(err => { throw err });
}

process.argv[2] ? compile() : bundle();