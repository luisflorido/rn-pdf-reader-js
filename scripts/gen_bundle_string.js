#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const encoding = { encoding: 'utf8' }

const scripts = {
  pdfJs: 'pdf.min.js',
  pdfViewer: 'pdf_viewer.min.js',
  pdfWorker: 'pdf.worker.min.js',
  reactDom: 'react-dom.production.min.js',
  react: 'react.production.min.js',
  bundle: 'bundle.js'
}

const read = (path) => fs.readFileSync(path, encoding)
const toBase64 = (str) => Buffer.from(str).toString('base64')

Object.keys(scripts).forEach(name => {
  const originPath = path.join(__dirname, `./js/${scripts[name]}`)
  const destinationPath = path.join(__dirname, `../src/${name}Container.ts`)

  const bundleString = read(originPath)
  const md5 = crypto.createHash('md5').update(bundleString).digest('hex')
  
  const bundleContainerFileContent = `
  import { Base64 } from 'js-base64';
  const bundle = '${toBase64(bundleString)}';
  export function getBundle() {
    return Base64.decode(bundle)
  }
  export function getBundleMd5() {
    return '${md5}'
  }
  `
  if (fs.existsSync(destinationPath)) {
    fs.unlinkSync(destinationPath)
  }
  fs.writeFileSync(destinationPath, bundleContainerFileContent, encoding)
})