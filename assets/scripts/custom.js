let selectedList = {};
let specUrls = {};
let descIdMap = {};

$.getJSON( getSettingPath(), function( data ) {
    let section = `
        <div class="accrodion" id="accordionRoot">
    `;
    let groupIdx = 0;
    $.each( data, function( group, items ) {
        if(group == 'title') {
            $('#toggleRender').text(items);
            return;
        }
        groupIdx += 1;
        let wrapper = `
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
               id="heading${groupIdx}" data-toggle="collapse" data-target="#collapse${groupIdx}">
            <span>${group}</span>
            <a class="d-flex align-items-center text-muted" href="#" aria-label="Docs of ${group} group">
              <span data-feather="chevrons-down"></span>
            </a>
          </h6>
          <div id="collapse${groupIdx}" aria-labelledby="heading${groupIdx}" data-parent="#accordionRoot" class="collapse">
            <ul class="nav flex-column mb-2">
        `;

        let itemIdx = 0;
        $.each(items, function( desc, specUrl ) {
            itemIdx += 1;
            selectedList[specUrl] = desc;
            let elemId = `group${groupIdx}Item${itemIdx}`;
            specUrls[elemId] = specUrl;
            descIdMap[desc] = elemId;
            let elem = `
              <li class="nav-item" id="${elemId}">
                <a class="nav-link" href="#${desc}">
                  <span data-feather="file-text"></span>
                  ${desc}
                </a>
              </li>
            `;
            wrapper += elem;
        });
        wrapper += `
            </ul>
          </div>
        `;
        section += wrapper;
    });
    section += "</div>";

    let parent = $("#sidebar > .sidebar-sticky");
    $(section).appendTo(parent);

    feather.replace();

    bindListenser();

    loadCurrentUrl();
});

function bindListenser() {
    let toggleFlag = true;
    $("#toggleDocs").on("click", function(e) {
        if(toggleFlag) {
            $("#sidebar").hide();
            $("#main").removeClass('col-lg-10');
            $("#main").addClass('col-lg-12');
            $("#toggleDocsDesc").text('Unfold');
            toggleFlag = false;
        } else {
            $("#sidebar").show();
            $("#main").removeClass('col-lg-12');
            $("#main").addClass('col-lg-10');
            $("#toggleDocsDesc").text('Fold');
            toggleFlag = true;
        }
    });

    $("#toggleRender").on("click", function(e) {
        let currRender = $("#main > rapi-doc").attr('render-style');
        let newRender = currRender === "read" ? "view" : "read";
        $("#main > rapi-doc").attr('render-style', newRender );
    });

    $("#searchContent").autocomplete({
        maximumItems: 6,
        source: selectedList,
        treshold: 1,
        onSelectItem: (selected, el) => {
            let specUrl = selected.label;
            loadSelected(specUrl);
        }
    });

    $("#searchAction").on("click", function(e) {
        let specUrl = $("#searchContent").val();
        loadSelected(specUrl);
    });

    $("#sidebar ul > li").on("click", function(e) {
        let elemId = $(e.currentTarget).attr("id");
        let specUrl = specUrls[elemId];
        $("#searchContent").val(specUrl);
        loadSelected(specUrl);
    });
};

function loadCurrentUrl() {
    let desc = window.location.hash;
    if(!desc) {
        return;
    }
    if(desc.length <= 1) {
        return;
    }
    desc = decodeURI(desc.substr(1));
    let elemId = descIdMap[desc];
    if( elemId && elemId.length > 0) {
        $(`#${elemId}`).click();
    }
}

function loadSelected(specUrl) {
    if(!specUrl || specUrl.length == 0) {
        return;
    }

    if(specUrl.endsWith('.json') || specUrl.endsWith('.yaml') || specUrl.endsWith('.yml')) {
        $("#main > rapi-doc").attr('spec-url', specUrl);
        $("#thirdDocs").empty();
        $("#thirdDocs").hide();
        $("#main > rapi-doc").show();
        return;
    }

    if(specUrl.endsWith('.md')) {
        $.get(specUrl, function(data) {
            document.getElementById("thirdDocs").innerHTML = marked(data);
            $("#main > rapi-doc").hide();
            $("#thirdDocs").show();
        });
        return;
    }

    if(specUrl.endsWith('.html') || specUrl.endsWith('.htm')) {
        $.get(specUrl, function(data) {
            let docs = /<body.*?>([\s\S]*)<\/body>/.exec(data);
            if(docs && docs[1]) {
                let content = $.parseHTML(docs[1], document, false);
                $("#thirdDocs").html(content);
            } else {
                toast('The format of the html is error.');
                console.log('The format of the html is error.')
            }
            $("#main > rapi-doc").hide();
            $("#thirdDocs").show();
        });
        return;
    }

    toast('This type of document is not supported currently.')
    console.log('This type of document is not supported currently.')
    return;
}

function getSettingPath() {
    let settingPath = "./assets/";
    let urlParams = new URLSearchParams(window.location.search);
    let settingFile = urlParams.get('setting');
    if(!settingFile) {
        settingFile = 'default';
    }
    if(!settingFile.endsWith(".json")) {
        settingFile += '.json';
    }
    settingPath += settingFile;

    return settingPath;
}

function toast(msg) {
    $('#toastElem').remove();
    let toastElem = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="1500"
             id="toastElem" style="position:absolute;left:40%;top:30%">
          <div class="toast-body">
              ${msg}
          </div>
        </div>
    `;
    $('body').append(toastElem);
    $('#toastElem').toast('show');
}