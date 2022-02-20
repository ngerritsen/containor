# Motivation

Containor does not care about your stack or application architecture, it is however opnionated on how a DI container should work.

## Code should not be aware of DI

A lot of DI containers use annotations or wrapper functions. Containor prefers dependencies not to be aware of the DI container. Why?

- This allows the DI container to be implemented with minimal impact and easily switched out.

- The whole point of inversion of control is that one depends on abstractions and is not aware of implementation. So not having specific tokens reside alongside classes, parameters or constructors is good thing.

## DI should be trivial

Containor aims to deliver all the features you might need, without being overengineered. In the end you care about your code, not the DI system.

Implementing Containor should be adding some files for DI setup and tokens and adjusting your imports and initialization, most other code should stay untouched.

## DI should be modular

Modern applications tend to be more modular, Containor has providers and modules that allow one to split their code into modules and only load what's neccesary.

Loading other modules can also mean code still needs to be loaded from elsewhere, this is why Containor supports async out of the box.
