# Using interfaces

A `Cat` and `Dog` will both be implementing the `Animal` interface, let's see how Containor handles this.

```ts
// Cat.ts
import { Animal } from "../types.ts";

class Cat implements Animal {
  public call() {
    return "meow!";
  }
}
```

```ts
// Dog.ts
import { Animal } from "../types.ts";

class Dog implements Animal {
  public call() {
    return "woof!";
  }
}
```

```ts
// types.ts
export interface Animal {
  call: () => string;
}
```

Type the tokens with the interface:

```ts
// tokens.ts
import { token } from "containor";
import { Animal } from "../types.ts";

export default {
  cat: token<Animal>("cat"),
  dog: token<Animal>("dog"),
};
```

Adding the `Cat` and `Dog` classes to the container will still typecheck them for implementing the `Animal` interface:

```ts
// di.ts
import { createContainer } from "containor";
import tokens from "./tokens";
import Cat from "./Cat";
import Dog from "./Dog";

const container = createContainer();

container.add(tokens.cat, Cat);
container.add(tokens.dog, Dog);

export default container;
```

When received from the container the `Cat` and `Dog` will be typed as `Animal`:

```ts
// index.ts
import container from "./di.ts";
import tokens from "./tokens.ts";

const cat = container.get(tokens.cat);
const dog = container.get(tokens.dog);

cat.call(); // meow!
dog.call(); // woof!
```
