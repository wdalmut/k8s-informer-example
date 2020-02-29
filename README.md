# K8S Shared Informer

Just an example of Shared Informers

## Run it

First of all create a new k8s cluster

```sh
kind create cluster --config kind.yaml
```

Then apply all templates

```sh
skaffold run
```

## Development

Just use skaffold in development mode

```
skaffold dev
```

