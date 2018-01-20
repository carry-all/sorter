"use strict";
angular.module('todoApp', [])
    .controller('TodoListController', function () {
        var todoList = this;

        todoList.result = [];

        todoList.sort = function (a, b) {
            if (a.listNumber < b.listNumber) {
                return -1;
            }

            if (a.listNumber > b.listNumber) {
                return 1;
            }

            if (a.initPos < b.initPos) {
                return -1;
            }

            if (a.initPos > b.initPos) {
                return 1;
            }

            return 0;
        };

        todoList.incoming1 = "";
        todoList.isIncoming1Sorted = false;
        todoList.incoming2 = "";
        todoList.isIncoming2Sorted = false;
        todoList.isIncoming2Activated = false;
        todoList.incoming3 = "";
        todoList.isIncoming3Sorted = false;
        todoList.isIncoming3Activated = false;
        todoList.state = {};
        todoList.state.finished = true;
        todoList.question = "";
        // todoList.initListOrder = [];

        todoList.first = function () {
            todoList.state.mergeResult.push(todoList.state.left[0]);
            todoList.state.left.splice(0, 1);
            todoList.iter();
        };

        todoList.second = function () {
            todoList.state.mergeResult.push(todoList.state.right[0]);
            todoList.state.right.splice(0, 1);
            todoList.iter();
        };

        todoList.activateList2 = function () {
            todoList.isIncoming2Activated = true;
        };

        todoList.activateList3 = function () {
            todoList.isIncoming3Activated = true;
        };

        todoList.iter = function () {
            if (todoList.state.finished) {
                return;
            }

            todoList.state.left = todoList.state.work[todoList.state.k];
            todoList.state.right = todoList.state.work[todoList.state.k + 1];

            if (todoList.state.left.length === 0 || todoList.state.right.length === 0) {
                todoList.state.toExec = true;

                // complete most internal cycly

                todoList.state.mergeResult = todoList.state.mergeResult.concat(todoList.state.left).concat(todoList.state.right);

                todoList.state.left.splice(0, todoList.state.left.length);
                todoList.state.right.splice(0, todoList.state.right.length);

                // complete work of inner for

                todoList.state.work[todoList.state.j] = todoList.state.mergeResult;
                todoList.state.mergeResult = [];

                // now I need to advance in inner for
                todoList.state.j = todoList.state.j + 1;
                todoList.state.k = todoList.state.k + 2;

                if (todoList.state.k >= todoList.state.lim) {
                    todoList.state.j = 0;
                    todoList.state.k = 0;
                    todoList.state.lim = Math.floor((todoList.state.lim + 1) / 2);

                    if (todoList.state.lim <= 1) {
                        todoList.state.finished = true;
                        // finished, nothing to do

                        // want to provide an initial list with numbers
                        var sorted = todoList.state.work[0].concat();
                        var ti, tl;
                        for (ti = 0, tl = sorted.length; ti < tl; ti++) {
                            //if (typeof sorted[ti] != 'undefined') {
                            sorted[ti].order = ti;
                            //}
                        }

                        todoList.initListOrder = sorted.sort(todoList.sort);

                        return;
                    }
                    // need to advance in outer for
                }

                todoList.iter();
                return;
            }

            todoList.state.toExec = false;
        };

        todoList.start = function () {
            todoList.state = {};
            todoList.state.finished = false;
            todoList.state.work = [];
            todoList.state.mergeResult = [];
            todoList.state.lim = 0;

            function registerIncomingList(incoming, isSorted, listNumber) {
                var len = incoming.length;

                // enrich values with their initial positions
                for (var i = 0; i < len; i++) {
                    var obj = {
                        "text": incoming[i],
                        "listNumber": listNumber,
                        "initPos": i
                    };
                    incoming[i] = obj;
                }

                if (isSorted) {
                    todoList.state.work.push(incoming);
                    todoList.state.lim++;
                } else {
                    // randomize a list
                    var incomingLeft = len;
                    while (incomingLeft) {
                        i = Math.floor(Math.random() * incomingLeft--);
                        var randomlyExtractedElement = incoming.splice(i, 1)[0];
                        todoList.state.work.push([randomlyExtractedElement]);
                        todoList.state.lim++;
                    }
                }
            }

            registerIncomingList(todoList.incoming1.split('\n'), todoList.isIncoming1Sorted, 1);
            if (todoList.isIncoming2Activated) {
                registerIncomingList(todoList.incoming2.split('\n'), todoList.isIncoming2Sorted, 2);
            }
            if (todoList.isIncoming3Activated) {
                registerIncomingList(todoList.incoming3.split('\n'), todoList.isIncoming3Sorted, 3);
            }

            todoList.state.work.push([]); // otherwise fails on a single element list
            todoList.state.j = 0;
            todoList.state.k = 0;

            todoList.iter();
        };

        todoList.remaining = function () {
            var count = 0;
            angular.forEach(todoList.todos, function (todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        todoList.archive = function () {
            var oldTodos = todoList.todos;
            todoList.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) todoList.todos.push(todo);
            });
        };
    });

