# nqm-app-minimal-meteor
A minimal meteor application demonstrating connection to a remote TDX DDP server. 

Provides a simple resource browser/explorer. Lists all available resources, grouped by folder, and allows preview of the data for dataset-based resources.

Demonstates how to subscribe to publications, make DDP method calls and apply filters to subscriptions. 

Supports authentication by share key and secret or via the authentication server.

Note that authenticating using a share key may not work properly if the share key does not have permissions to access any top-level folders or resources, since the explorer starts off by showing all resources that descend from the root folder. You can circumvent this if you know the resource id of a folder or resource by pasting it directly into the URL.

For example, the default URL is

```
http://localhost:3000/explorer
```

To show all resources that are contained in a folder with id `r1e34rSFx` enter the URL

```
http://localhost:3000/explorer/r1e34rSFx
```

## install
install meteor

```
curl https://install.meteor.com/ | sh
````

clone this repo

```
git clone https://github.com/nqminds/nqm-app-minimal-meteor
```

switch to the application folder

```
cd nqm-app-minimal-meteor
```

install packages

```
npm install
```

## run
```
meteor run --settings ./settings.json
```

to use a port other than the default of 3000

```
meteor run --settings ./settings.json --port <port number>
```
