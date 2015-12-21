(function () {
    'use strict';
    //var mysql = require('mysql');

    // Creates MySql database connection
    /*var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "customer_manager"
    });*/

    var fs = require("fs");
    var file = "electron-invoice.db";
    var exists = fs.existsSync(file);

    if(!exists) {
      console.log("Creating DB file.");
      fs.openSync(file, "w");
    }

    var sqlite3 = require('sqlite3').verbose();

    // Creates sqlite3 database connection
    var db = new sqlite3.Database(file);

    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS customers ( " +
              "customer_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
              "name TEXT NOT NULL, " +
              "street TEXT NULL, " +
              "address TEXT NULL, " +
              "city TEXT NULL " +
              "); ");
    });

    angular.module('app')
        .service('customerService', ['$q', CustomerService]);

    function CustomerService($q) {
        return {
            getCustomers: getCustomers,
            getById: getCustomerById,
            getByName: getCustomerByName,
            create: createCustomer,
            destroy: deleteCustomer,
            update: updateCustomer
        };

        function getCustomers() {
            var deferred = $q.defer();
            var query = "SELECT * FROM customers";
            db.each(query, function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function getCustomerById(id) {
            var deferred = $q.defer();
            var query = "SELECT * FROM customers WHERE customer_id = ?";
            db.each(query, [id], function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function getCustomerByName(name) {
            var deferred = $q.defer();
            var likeName = "%" + name + "%";
            var query = "SELECT * FROM customers WHERE name LIKE ?";
            db.each(query, [likeName], function (err, rows) {
                console.log(err)
                if (err) deferred.reject(err);

                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function createCustomer(customer) {
            var deferred = $q.defer();
            var query = "INSERT INTO customers SET ?";
            db.run(query, customer, function (err, res) {
                console.log(err)
                if (err) deferred.reject(err);
                console.log(res)
                deferred.resolve(res.lastID);
            });
            return deferred.promise;
        }

        function deleteCustomer(id) {
            var deferred = $q.defer();
            var query = "DELETE FROM customers WHERE customer_id = ?";
            db.run(query, [id], function (err, res) {
                if (err) deferred.reject(err);
                console.log(res);
                deferred.resolve(res.affectedRows);
            });
            return deferred.promise;
        }

        function updateCustomer(customer) {
            var deferred = $q.defer();
            var query = "UPDATE customers SET name = ? WHERE customer_id = ?";
            db.run(query, [customer.name, customer.customer_id], function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res);
            });
            return deferred.promise;
        }
    }
})();
