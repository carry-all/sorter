    angular.module('todoApp', [])
      .controller('TodoListController', function() {
        var todoList = this;
        todoList.list1 = [
          {text:'1', done:true},
          {text:'6', done:false},
		  {text:'10', done:false},
		  {text:'3', done:true},
          {text:'9', done:false},
		  {text:'15', done:false},
		  ];
		  
		todoList.list2 = [
          {text:'3', done:true},
          {text:'9', done:false},
		  {text:'15', done:false},
		  ];
		
		todoList.result = [
		];
		
		todoList.sort = function(a,b) {
			if (a.initPos < b.initPos)
				return -1;
			if (a.initPos > b.initPos)
				return 1;
			return 0;
		}

		todoList.incoming = "";
		todoList.initListOrder = [];
     
        todoList.first = function() {
          todoList.state.mergeResult.push(todoList.state.left[0]);
		  todoList.state.left.splice(0,1);
		  todoList.iter();
        };
		
		todoList.second = function() {
          todoList.state.mergeResult.push(todoList.state.right[0]);
		  todoList.state.right.splice(0,1);
		  todoList.iter();
        };
		
		todoList.iter = function() {
			if (todoList.state.finished) {
				return;
			}
			
			todoList.state.left = todoList.state.work[todoList.state.k];
			todoList.state.right = todoList.state.work[todoList.state.k+
			1];
			if (todoList.state.left.length === 0 || todoList.state.right.length === 0) {
				todoList.state.toExec = true;
				
				// complete most internal cycly
				
				todoList.state.mergeResult = todoList.state.mergeResult.concat(todoList.state.left).concat(todoList.state.right)
				
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
					todoList.state.lim = Math.floor((todoList.state.lim+1)/2);
					
					if (todoList.state.lim <= 1) {
						todoList.state.finished = true;
						// finished, nothing to do
						
						// want to provide an initial list with numbers
						var sorted = todoList.state.work[0].concat();
						var ti, tl;
						for (ti=0, tl=sorted.length; ti < tl; ti++){
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
		
		todoList.start = function() {
			todoList.state = {};
			todoList.state.work = [];
			todoList.state.mergeResult = [];

			var incoming = todoList.incoming.split('\n');
			
			var i, len;
			for (i=0, len=incoming.length; i < len; i++){
				var obj = {};
				obj.text = incoming[i];
				obj.initPos = i;
				
				todoList.state.work.push([obj]);
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

