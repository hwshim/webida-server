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

/*var config = require('../../common/conf-manager').conf;
var db = require('mongojs').connect(config.db.fsDb, ['wfs', 'wfs_del', 'ks']);
db.wfs.ensureIndex({fsid: 1}, {unique: true});
db.wfs_del.ensureIndex({fsid: 1}, {unique: true});
db.ks.ensureIndex({ fsid: 1, uid: 1, alias: 1, filename: 1 }, { unique: true });
db.ks.ensureIndex({ uid: 1, alias: 1 }, { unique: true });*/

var dataMapperConf = require('../../conf/data-mapper-conf.json');
var dataMapper = require('data-mapper').init(dataMapperConf);
var keyStoreDao = dataMapper.dao('keyStore');
var userDao = dataMapper.dao('user');


exports.getDb = function () {
    return keyStoreDao;
};

exports.getKsInfo = function (uid, alias, callback) {
    userDao.$findOne({uid: uid}, function (err, user) {
        if (err) {
            callback(err);
        } else if (user) {
            keyStoreDao.$find({userId: user.userId, alias: alias}, callback);
        } else {
            callback('Unkown User: ' + uid);
        }
    });
};
/*
exports.close = function () {
    db.close();
};
*/

