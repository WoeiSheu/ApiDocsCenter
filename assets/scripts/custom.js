let specUrls = {};
let selectedList = {};

$.getJSON( "/assets/setting.json", function( data ) {
    //console.log(data);
    let section = `
        <div class="accrodion" id="accordionRoot">
    `;
    let idx = 0;
    $.each( data, function( group, items ) {
        idx += 1;
        let wrapper = `
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
               id="heading${idx}" data-toggle="collapse" data-target="#collapse${idx}">
            <span>Group ${group}</span>
            <a class="d-flex align-items-center text-muted" href="#" aria-label="Docs of ${group} group">
              <span data-feather="chevrons-down"></span>
            </a>
          </h6>
          <div id="collapse${idx}" aria-labelledby="heading${idx}" data-parent="#accordionRoot" class="collapse">
            <ul class="nav flex-column mb-2">
        `;
        $.each(items, function( title, specUrl ) {
            specUrls[title] = specUrl;
            selectedList[specUrl] = title;
            let elem = `
              <li class="nav-item" id="${title}">
                <a class="nav-link" href="#${title}">
                  <span data-feather="file-text"></span>
                  ${title}
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
            $("#toggleDocsDesc").text('展开目录');
            toggleFlag = false;
        } else {
            $("#sidebar").show();
            $("#main").removeClass('col-lg-12');
            $("#main").addClass('col-lg-10');
            $("#toggleDocsDesc").text('收起目录');
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
            //console.log(selected.label);
            //console.log(selected.value);
            $("#main > rapi-doc").attr('spec-url', selected.label);
        }
    });

    $("#searchAction").on("click", function(e) {
        let specUrl = $("#searchContent").val();
        //console.log(specUrl);
        if(specUrl != '') {
            $("#main > rapi-doc").attr('spec-url', specUrl);
        }
    });

    $("#sidebar ul > li").on("click", function(e) {
        //console.log(e.currentTarget);
        let id = $(e.currentTarget).attr("id");
        let specUrl = specUrls[id];
        $("#searchContent").val(specUrl);
        $("#main > rapi-doc").attr('spec-url', specUrl);
    });
};

function loadCurrentUrl() {
    let id = window.location.hash;
    //console.log(id);
    if( id.length > 0) {
        $(id).click();
    }
}