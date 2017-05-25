    angular.module('todoApp', [])
      .controller('TodoListController', function() {
        var todoList = this;
        todoList.list1 = [
          {text:'1', done:true},
          {text:'6', done:false},
		  {text:'10', done:false},
		  ];
		  
		todoList.list2 = [
          {text:'3', done:true},
          {text:'9', done:false},
		  {text:'15', done:false},
		  ];
		
		todoList.result = [
		];
		
		todoList.incoming = "";
     
        todoList.first = function() {
          todoList.result.push(todoList.list1[0]);
		  todoList.list1.splice(0,1);
        };
		
		todoList.second = function() {
          todoList.result.push(todoList.list2[0]);
		  todoList.list2.splice(0,1);
        };
		
		todoList.iter = function() {
			todoList.state.left = todoList.state.work[todoList.state.k];
			todoList.state.right = todoList.state.work[todoList.state.k+1];
			if (todoList.state.left.length === 0 || todoList.state.right.length === 0) {
				todoList.state.toExec = true;
				return;
			}
			
			todoList.state.toExec = false;
		};
		
		todoList.start = function() {
			todoList.state = {};
			todoList.state.work = [];
			//todoList.state.work = todoList.list1; // todo: read from incoming
			
			var i, len;
			for (i=0, len=todoList.list1.length; i < len; i++){
				todoList.state.work.push([todoList.list1[i]]);
			}
			todoList.state.work.push([]);

			todoList.state.len = len;
			todoList.state.lim = len;
			todoList.state.j = 0;
			todoList.state.k = 0;
			
			todoList.iter();
        };
     
        todoList.remaining = function() {
          var count = 0;
          angular.forEach(todoList.todos, function(todo) {
            count += todo.done ? 0 : 1;
          });
          return count;
        };
     
        todoList.archive = function() {
          var oldTodos = todoList.todos;
          todoList.todos = [];
          angular.forEach(oldTodos, function(todo) {
            if (!todo.done) todoList.todos.push(todo);
          });
        };
      });

