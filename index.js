var test = require('tape')
var path = require('path')
var fs = require('fs')
var tiny = require('tiny-json-http')
var aws = require('aws-sdk')
var zip = require('cross-zip')
var env = require('node-env-file')

env(path.join(process.cwd(), '.env'))

var lambda = new aws.Lambda({region:'us-east-1'})
var py = process.env.PYTHON_ENDPOINT 
var no = process.env.NODE_ENDPOINT

test('reset python lambda code', t=> {
  t.plan(1)
  lambda.updateFunctionCode({
    FunctionName: 'test-python-hello',
    Publish: true,
    ZipFile: fs.readFileSync(path.join(process.cwd(), 'test-python-hello.zip'))
  }, 
  function _updateFunction(err, result) {
    if (err) {
      t.fail('failed to update fn')
      console.log(err)
    }
    else {
      t.ok(result, 'updated')
      console.log(result)
    }
  })
})

test('reset node lambda code', t=> {
  t.plan(1)
  lambda.updateFunctionCode({
    FunctionName: 'test-node-hello',
    Publish: true,
    ZipFile: fs.readFileSync(path.join(process.cwd(), 'test-node-hello.zip'))
  }, 
  function _updateFunction(err, result) {
    if (err) {
      t.fail('failed to update fn')
      console.log(err)
    }
    else {
      t.ok(result, 'updated')
      console.log(result)
    }
  })
})

// time get to python
test('python time', t=> {
  t.plan(1)
  console.time('python')
  tiny.get({url:py}, function _get(err, data) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data.body.ok, 'got data')
      console.timeEnd('python')
    }
  })
})

// time get to node
test('node time', t=> {
  t.plan(1)
  console.time('node')
  tiny.get({url:no}, function _get(err, data) {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data.body.ok, 'got data')
      console.timeEnd('node')
    }
  })
})
