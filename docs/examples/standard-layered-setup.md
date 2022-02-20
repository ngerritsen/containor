# Standard layered setup

Typical controller, service, repository setup. This example should give an idea on how you can structure a project.

```
/etc
  config.ts
/src
  /todos
    module.ts
    TodoController.ts
    TodoService.ts
    TodoRepository.ts
  di.ts
  index.ts
  tokens.ts
```

> This controller, service, repository setup is just an easy example, use whatever application architecture you'd like.

These are the fake classes we are working with:

```ts
// todos/TodoController.ts
class TodoController {
  public constructor(private todoService: TodoService);
  public getAll() {}
}
```

```ts
// todos/TodoService.ts
class TodoService {
  public constructor(private todoRepository: TodoRepository);
  public getAll() {}
}
```

```ts
// todos/TodoRepository.ts
import { Connection } from "database";

class TodoRepository {
  public constructor(private connection: Connection);
  public getAll() {}
}
```

Tokens neatly defined in a central file:

```ts
// tokens.ts
import { token } from "containor";
import { Connection } from "database";

export default {
  todoController: token<TodoController>("todoController"),
  todoService: token<TodoService>("todoService"),
  todoRepository: token<TodoRepository>("todoRepository"),
  databaseConnection: token<Connection>("databaseConnection"),
  connectionString: token<string>("connectionString"),
};
```

```ts
// todos/module.ts
import { createModule } from "containor";
import { Connection } from "database";
import tokens from "../tokens";
import TodoController from "./TodoController";
import TodoService from "./TodoService";
import TodoRepository from "./TodoRepository";

export default createModule([tokens.todoController], (c) => {
  c.add(tokens.todoController, TodoController, [tokens.todoService]);
  c.add(tokens.todoService, TodoService, [tokens.todoRepository]);
  c.add(tokens.todoRepository, TodoRepository, [tokens.databaseConnection]);
});
```

> Note how the module only provides the controller, since this is the only dependecy we're going to directly retrieve. Expose only the neccesary dependecies!

Container setup defined in a separate file, exporting the container:

```ts
// di.ts
import { createContainer } from "containor";
import { Connection } from "database";
import tokens from "./tokens";
import config from "../etc/config";
import todoModule from "./todos/module";

const container = createContainer();

container.add(tokens.databaseConnection, Connection, [tokens.connectionString]);
container.constant(tokens.connectionString, config.db.connectionString);

container.use(todoModule);

export default container;
```

Import the container when bootstrapping the application:

```ts
// index.ts
import container from "./di.ts";
import tokens from "./tokens.ts";

export function getAll() {
  const todoController = container.get(tokens.todoController);

  return todoController.getAll();
}
```
