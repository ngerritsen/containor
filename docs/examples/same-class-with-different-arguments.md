# Same class with different arguments

Containor allows you to re-use classes, but with different arguments in different contexts. This can be useful in a lot of situations.

Let's say we have these two use cases, they both need a database connection, but we want to limit the `GetUserUseCase` to only allow database reads, whereas `SaveUserUseCase` is allowed to write.

```ts
// GetUserUseCase.ts
class GetUserUseCase() {
  public constructor(private database: Connection) {}
  public function get {}
}
```

```ts
// SaveUserUseCase.ts
class SaveUserUseCase() {
  public constructor(private database: Connection) {}
  public function save {}
}
```

Let's define the tokens, notice how we define two for the connection class.

```ts
// tokens.ts
import { token } from "containor";
import { Connection } from "database";
import SaveUserUseCase from "./users/SaveUserUseCase";
import GetUserUseCase from "./users/GetUserUseCase";

export default {
  saveUser: token<SaveUserUseCase>("saveUser"),
  getUser: token<GetUserUseCase>("getUser"),
  readConnecton: token<Connection>("readConnecton"),
  writeConnection: token<Connection>("writeConnection"),
};
```

Now we can register the Connection class twice, but we inject different configuration arguments:

```ts
// di.ts
import { createContainer, raw } from "containor";
import { Connection } from "database";
import config from "../etc/config";
import SaveUserUseCase from "./users/SaveUserUseCase";
import GetUserUseCase from "./users/GetUserUseCase";
import tokens from "./tokens";

const container = createContainer();

container.add(tokens.getUser, GetUserUseCase, [tokens.readConnecton]);
container.add(tokens.saveUser, SaveUserUseCase, [tokens.writeConnection]);
container.add(tokens.readConnecton, Connection, [raw(config.db.read)]);
container.add(tokens.writeConnection, Connection, [raw(config.db.write)]);

export default container;
```

> Notice how we inject the two different variations of `Connection` into the use cases without those classes being aware of that, all they know is that they need a `Connection`. This makes us flexible in changing the permissions later on.

Now when we get the two different use cases, they will be injected with the appropriate connections:

```ts
//index.ts
import tokens from "./tokens";
import container from "./di.ts";

const getUser = container.get(tokens.getUser);
const saveUser = container.get(tokens.saveUser);
```
