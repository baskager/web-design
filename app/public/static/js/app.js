/**
* Main javascript file for my personal website
*
* @author  Bas Kager
* @version 1.0
* @since   25-04-2018
*/
(function () {

    function $(element)
    {
        return document.querySelector(element);
    }

    const projects = {
        self: this,
        list: null,
        _load: function(path, callback, error) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function()
            {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (callback)
                            callback(JSON.parse(xhr.responseText));
                    } else {
                        if (error)
                            error(xhr);
                        }
                    }
            };
            xhr.open("GET", path, true);
            xhr.send();
        },
        get: function(callback) {
            console.log("fetching projects...");
            // Check if projects are stored in memory, if noy load the json file.
            if(self.list == null) {
                console.log("List not saved in memory yet");
                this._load("./static/js/projects.json", function(json) {
                    // Success
                    self.list = json;
                    callback(self.list);
                }, function(err) {
                    // Error
                    alert("ERROR: could not load projects");
                    console.log(err);
                })
            } else {
                console.log("list already saved in memory");
                callback(self.list);
            };
        }
    }

    const thumbnail = {
        reset: function(thumbnailId) {

        },
        resetAll: function(){

        },
        build: function(thumbnailId, project, categoryName) {
            $(thumbnailId + ' h3').innerHTML = project.name;
            $(thumbnailId + ' p').innerHTML = project.shortDescription;
            $(thumbnailId + ' img').setAttribute('src', project.thumbnailUri);
            $(thumbnailId + ' a').setAttribute('href', '#projects/' + categoryName + '/' + project.slug);
            // Do something with tags
        }
    }

    const modalDialog = {
        open: function(dialogName) {
            $(dialogName).classList.add('open');
        },
        close: function(dialogName) {
            $(dialogName).classList.remove('open');
        },
        closeAll: function() {
            $('#project').classList.remove('open');
            $('#projectList').classList.remove('open');
        }
    }

    const header = {
        fade: function(dialogName) {
            $('header').classList.remove('unfade');
            $('header').classList.add('fade');
        },
        unfade: function(dialogName) {
            $('header').classList.add('unfade');
            $('header').classList.remove('fade');
        }
    }

    const app = {
        start: function() {
            // Pre-load projects
            projects.get(function() {

            });
        }
    }
    routie('', function(projectListName) {
        modalDialog.closeAll();
        header.unfade();
    });

    routie('projects/:projectListName/:projectSlug', function(projectListName, projectSlug) {
        header.fade();
        projects.get(function(projects){
            modalDialog.close('#projectList');
            modalDialog.open('#project');

            var project = projects[projectListName].projects.filter(function(project) {
                return project.slug == projectSlug;
            })[0];
            
            if(project) {
                $('b').innerHTML = project.name;
            } else {
                $('b').innerHTML = "I am terribly sorry but something went wrong, please try to reload the page.";
            }

        })
    });

    routie('projects/:projectListName', function(projectListName) {
        header.fade();
        projects.get(function(projects){
            modalDialog.close('#project');
            modalDialog.open('#projectList');

            if(projects[projectListName]) {
                $('blockquote').innerHTML = projects.programming.description;
                for(let i = 0; i < projects.programming.projects.length; i ++) {
                    var project = projects.programming.projects[i];
                    var thumbnailId = '#project'+ (i+1);
                    
                    thumbnail.build(thumbnailId, project, projectListName);
                }
            } else {
                $('blockquote').innerHTML = "I am terribly sorry but something went wrong, please try to reload the page.";
            }

        })

    });

    

    app.start();
})();