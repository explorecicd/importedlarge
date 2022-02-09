// file:///Users/kooper/git/clowder/scripts/funpage/index.html?url=https://clowder.ncsa.illinois.edu/clowder/&key=4e1acfe7-bd4d-4a5c-8035-a3e544c46154#

$(window).on('hashchange', showData);
$("#clowder_go").click(showData);

function showData() {
    $(".nav-item").removeClass("active");
    $('#clowder_content').html("loading ...<hr>");

    var hash = location.hash.replace(/^#/, '');
    if (hash == '') hash = 'spaces';

    $("#clowder_nav_" + hash).addClass("active");
    if (hash == "spaces" || hash == "") {
        showSpaces();
    } else if (hash == "collections") {
        showCollections();
    } else if (hash == "datasets") {
        showDatasets();
    } else {
        console.log("ERROR with hash  " + hash);
        showSpaces();
    }
}

function getUrlParameter(sParam, defaultValue) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return defaultValue;
};

function getURL(path) {
    var url=$("#clowder_url").val();
    if (url == '') {
        url=getUrlParameter('url', 'https://clowder.ncsa.illinois.edu/clowder/');
    }
    if (!url.endsWith("/")) {
        url = url + "/";
    }
    $("#clowder_url").val(url);

    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    url = url + path;

    var key=$("#clowder_key").val();
    if (key == '') {
        key = getUrlParameter('key', '');
    }
    $("#clowder_key").val(key);
    if (key != '') {
        url = url + '?key=' + key;
    }
    
    return url;
}

function showHeader() {
    $("#clowder_logo").html('<img style="height: 1em;" id="clowder_img" src="' + getURL('api/logos/GLOBAL/logo/blob') + '">');
    $('#clowder_img').on('error', function() {
        $("#clowder-logo").text("Clowder");
    });
}

function createCard(id, thumbnail, title, description, created, type) {
    text = "";

    text += '<div class="col-md-4">';
    text += '  <div class="card mb-4 box-shadow">';
    if (thumbnail && thumbnail != '' && thumbnail != 'None') {
        text += '    <img class="card-img-top" src="' + getURL('fileThumbnail/' + thumbnail + '/blob') + '">';
    }
    text += '    <div class="card-body">';
    text += '      <h2>' + title + '</h2>';
    text += '      <p>' + description + '</p>';
    text += '      <div class="d-flex justify-content-between align-items-center">';
    text += '        <div class="btn-group">';
    text += '          <a href="' + getURL(type + '/' + id) + '" class="btn btn-sm btn-outline-secondary" role="button">View</a>';
    text += '        </div>';
    text += '      </div>'
    text += '      <small class="text-muted">' + created + '</small>';
    text += '    </div>';
    text += '  </div>';
    text += '</div>';

    return text;
}

function showSpaces() {
    $.get(getURL('api/spaces'), function(data) {
        text = "";
        count = 0;
        $.each(data, function(index, item) {
            if (count == 3) {
                text += '</div>';
                count = 0;
            }
            if (count == 0) {
                text += '<div class="row">';
            }
            count +=1;
            text += createCard(item['id'], item['thumbnail'], item['name'], item['description'], item['created'], 'spaces');
        });

        if (count != 0) {
            text += "</div>";
        }
        text += "<hr></div>";

        $('#clowder_content').html(text);
    }).fail(function(xhr, status, error) {
        $('#clowder_content').html(error + '<hr>');
    });
}

function showCollections() {
    $.get(getURL('api/collections'), function(data) {
        text = "";
        count = 0;
        $.each(data, function(index, item) {
            if (count == 3) {
                text += '</div>';
                count = 0;
            }
            if (count == 0) {
                text += '<div class="row">';
            }
            count +=1;
            text += createCard(item['id'], item['thumbnail'], item['collectionname'], item['description'], item['created'], 'collection');
        });

        if (count != 0) {
            text += "</div>";
        }
        text += "<hr></div>";

        $('#clowder_content').html(text);
    }).fail(function(xhr, status, error) {
        $('#clowder_content').html(error + '<hr>');
    });
}

function showDatasets() {
    $.get(getURL('api/datasets'), function(data) {
        text = "";
        count = 0;
        $.each(data, function(index, item) {
            if (count == 3) {
                text += '</div>';
                count = 0;
            }
            if (count == 0) {
                text += '<div class="row">';
            }
            count +=1;
            text += createCard(item['id'], item['thumbnail'], item['name'], item['description'], item['created'], 'datasets');
        });

        if (count != 0) {
            text += "</div>";
        }
        text += "<hr></div>";

        $('#clowder_content').html(text);
    }).fail(function(xhr, status, error) {
        $('#clowder_content').html(error + '<hr>');
    });
}
