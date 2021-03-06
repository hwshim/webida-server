/*
 * Copyright (c) 2012-2015 S-Core Co., Ltd.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fsExtra = require('fs-extra');
var path = require('path');
var async = require('async');
var conf = require('./common/conf-manager').conf;

var db = require('../common/db-manager')('system');
var dao = db.dao;

function deleteDeployedApps(callback) {
    var src = conf.appsPath;
    var dest = path.normalize(conf.appsPath + '/../uninstalled-apps-' + Date.now());

    fsExtra.rename(src, dest, function (err) {
        console.log('delete files', err);
        if (err && err.errno !== 34) {
            return callback(err);
        }
        return callback(null);
    });
}

function deleteMongoTable(callback) {
    dao.system.dropAppTable(function (err) {
        console.log('drop database webida_app', err);
        return callback(err);
    });
}

async.series([
    deleteDeployedApps,
    deleteMongoTable
], function (err/*, results*/) {
    if (err) {
        console.log('uninstall failed.', err);
    } else {
        console.log('uninstall successfully completed.');
    }

    process.exit();
});
