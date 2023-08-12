import a from './moduleA/a.js'
import { b } from './moduleB'
import c = require('./moduleC')
a.log('123')

a.foo()
b('456')
c()
