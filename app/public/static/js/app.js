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

    const render = {
        resetThumbnail(thumbnailId) {
            $(thumbnailId + ' h3').innerHTML = '';
            $(thumbnailId + ' p').innerHTML = '';
            $(thumbnailId + ' img').setAttribute('src', '');
            $(thumbnailId + ' a').setAttribute('href', '');
        },
        thumbnail: function(thumbnailId, project, categoryName) {
            $(thumbnailId + ' h3').innerHTML = project.name;
            $(thumbnailId + ' p').innerHTML = project.shortDescription;
            $(thumbnailId + ' img').setAttribute('src', project.thumbnailUri);
            $(thumbnailId + ' a').setAttribute('href', '#projects/' + categoryName + '/' + project.slug);
            // Do something with tags
        },
        resetProject() {
            $('#project h2').innerHTML = '';
            $('#project img').setAttribute('src', '');
            $('#project #process').innerHTML = '';
        },
        project: function(project, categoryName) {
            $('#project h2').innerHTML = project.name;
            $('#project img').setAttribute('src', project.thumbnailUri);
            $('#project #process').innerHTML = project.longDescription;
            if(project.demoUri) {
                $('#project #demoUri').classList.remove('hide');
                $('#project #demoUri').setAttribute('href', project.demoUri);
            } else {
                $('#project #demoUri').classList.add('hide');
            }
            if(project.repoUri) {
                $('#project #repoUri').classList.remove('hide');
                $('#project #repoUri').setAttribute('href', project.repoUri);
            } else {
                $('#project #repoUri').classList.add('hide');
            }
        },
        randomSuggestion: function(currentCategory, categories) {
            var filteredCategories = [];

            for (var category in categories) {
                if(category !== currentCategory) {
                    filteredCategories.push(category);
                }
            }
            var randomNum = Math.floor((Math.random()*filteredCategories.length));
            var suggestion = filteredCategories[randomNum];
            var suggestionUri = '#projects/' + suggestion;

            $('.suggestion a').setAttribute('href', suggestionUri);
            $('.suggestion a').innerHTML = 'Show me some ' + suggestion + ' projects';
        }

    }

    const modalDialog = {
        open: function(dialogName) {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            $(dialogName).scrollTop =0;
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

    routie('projects/:projectListName', function(projectListName) {
        header.fade();
        projects.get(function(projects){
            modalDialog.close('#project');
            modalDialog.open('#projectList');
            render.resetThumbnail('#project1');
            render.resetThumbnail('#project2');
            $('#projectListContent h2').innerHTML = projectListName + ' projects';


            if(projects[projectListName]) {
                $('blockquote').innerHTML = projects[projectListName].description;
                for(let i = 0; i < projects[projectListName].projects.length; i ++) {
                    var project = projects[projectListName].projects[i];
                    var thumbnailId = '#project'+ (i+1);
                    
                    render.thumbnail(thumbnailId, project, projectListName);
                }
            } else {
                $('blockquote').innerHTML = "I am terribly sorry but something went wrong, please try to reload the page.";
            }

        })

    });

    routie('projects/:projectListName/:projectSlug', function(projectListName, projectSlug) {
        header.fade();
        projects.get(function(projects){
            modalDialog.close('#projectList');
            modalDialog.open('#project');
            render.resetProject();
            $('#closeProject').innerHTML = "Back to " + projectListName + " projects";
            $('#closeProject').setAttribute('href', '#projects/' + projectListName);

            var project = projects[projectListName].projects.filter(function(project) {
                return project.slug == projectSlug;
            })[0];
        
            if(project) {
                render.project(project, projectListName);
                render.randomSuggestion(projectListName, projects);
            } else {
                $('b').innerHTML = "I am terribly sorry but something went wrong, please try to reload the page.";
            }

        })
    });

    

    app.start();
})();