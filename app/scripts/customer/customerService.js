(function () {
    'use strict';

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
          Customer.findAll();
        }

        function getCustomerById(id) {
            Customer.findById(id).then(function(customer) {
              console.log(customer);
            })
        }

        function getCustomerByName(name) {
            var deferred = $q.defer();
            var likeName = "%" + name + "%";
            var query = "SELECT * FROM customers WHERE name1 LIKE ? or name2 like ?";
            db.each(query, [likeName,likeName], function (err, rows) {
                console.log(err)
                if (err) deferred.reject(err);

                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function createCustomer(customer) {
          Customer
            .create(customer)
            .then(function(customer) {
              console.log(customer.get('name1')); // John Doe (SENIOR ENGINEER)
              console.log(customer.get('name2')); // SENIOR ENGINEER
            })
        }

        function deleteCustomer(id) {
            var deferred = $q.defer();
            var query = "DELETE FROM customers WHERE id = ?";
            db.run(query, [id], function (err, res) {
                if (err) deferred.reject(err);
                console.log(res);
                deferred.resolve(res.changes);
            });
            return deferred.promise;
        }

        function updateCustomer(customer) {
            var deferred = $q.defer();
            var query = "UPDATE customers SET name1 = ? WHERE id = ?";
            db.run(query, [customer.name1, customer.id], function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res);
            });
            return deferred.promise;
        }
    }
})();
