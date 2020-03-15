Api Docs Center
======

### Background
Many programmers have troubles with api documents, especially when they need to work together with other programmers.
By the way, because of the microservice architecture, this problem seems to be more prominent.

Some developers tend to write api documents in Swagger/OpenApi, while others may write in Markdown and even convert it to html.
It is confusing to manage these documents in one place properly.
This repo provide an example to show you how to manage the API documents.

### Install
`git clone https://github.com/WoeiSheu/ApiDocsCenter.git`
Provide a server for the repo, like nginx.

### Usage
Just open the url in the browser.
#### Custom setting file
You can create your own setting file in assets folder and pass it as a parameter in uri.
Like <http://path/?setting=project>
`default.json` is used if no setting file is provided.
#### Format of setting file
The setting file is in standard json format, and provide two level of organization.
The first level is a group name, and the second level is a map of description and url of api documents.
Additionally, the project title can be customized by `title` property in setting file.

### Related Efforts
Thanks to these libraries.
1. [bootstrap-4-autocomplete](https://github.com/Honatas/bootstrap-4-autocomplete)
2. [Bootstrap](https://github.com/twbs/bootstrap)
3. [Feather](https://github.com/feathericons/feather)
4. [jQuery](https://github.com/jquery/jquery)
5. [Marked](https://github.com/markedjs/marked)
6. [RapiDoc](https://github.com/mrin9/RapiDoc)

### Maintainers
@WoeiSheu

### Contributing
Welcome to contribute.
If you are a new member of this project, feel free to ask the maintainers for help.

#### Example
Here is an example to you.
<https://blog.xuwei.fun/ApiDocsCenter/?setting=default#Uspto>


### Licence
MIT License