var columnDefs = [
  {
    field: 'athlete',
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['reset', 'apply'],
    },
  },
  {
    field: 'age',
    maxWidth: 100,
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['apply', 'reset'],
      closeOnApply: true,
    },
  },
  {
    field: 'country',
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['clear', 'apply'],
    },
  },
  {
    field: 'year',
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['apply', 'cancel'],
      closeOnApply: true,
    },
    maxWidth: 100,
  },
  { field: 'sport' },
  { field: 'gold', filter: 'agNumberColumnFilter' },
  { field: 'silver', filter: 'agNumberColumnFilter' },
  { field: 'bronze', filter: 'agNumberColumnFilter' },
  { field: 'total', filter: 'agNumberColumnFilter' },
];

var gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
  },
  onFilterChanged: function (e) {
    console.log('onFilterChanged', e);
    console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
  },
  onFilterModified: function (e) {
    console.log('onFilterModified', e);
    console.log('filterInstance.getModel() =>', e.filterInstance.getModel());
    console.log(
      'filterInstance.getModelFromUi() =>',
      e.filterInstance.getModelFromUi()
    );
  },
  
  
};

// XMLHttpRequest in promise format
/* function makeRequest(method, url, success, error) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.responseType = "arraybuffer";

    httpRequest.open(method, url);
    httpRequest.onload = function () {
        success(httpRequest.response);
    };
    httpRequest.onerror = function () {
        error(httpRequest.response);
    };
    httpRequest.send();
} */

/* set up XMLHttpRequest */
var url = "https://arlgservices.co.uk/wp-content/export.xlsx";
var oReq = new XMLHttpRequest();

oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function(e) {
  var arraybuffer = oReq.response;

  /* convert data to binary string */
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join("");

  /* Call XLSX */
  var workbook = XLSX.read(bstr, {type:"binary"});

  /* DO SOMETHING WITH workbook HERE */
  var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];

    // we expect the following columns to be present
    var columns = {
        'A': 'athlete',
        'B': 'age',
        'C': 'country',
        'D': 'year',
        'E': 'date',
        'F': 'sport',
        'G': 'gold',
        'H': 'silver',
        'I': 'bronze',
        'J': 'total'
    };

    var rowData = [];

    // start at the 2nd row - the first row are the headers
    var rowIndex = 2;

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
        var row = {};
        Object.keys(columns).forEach(function(column) {
            row[columns[column]] = worksheet[column + rowIndex].w;
        });

        rowData.push(row);

        rowIndex++;
    }

    // finally, set the imported rowData into the grid
    gridOptions.api.setRowData(rowData);
	populateGrid(workbook);
	
	var workbook = convertDataToWorkbook(data);

            populateGrid(workbook);
}

oReq.send();

// read the raw data and convert it to a XLSX workbook
/* function convertDataToWorkbook(data) { */
    /* convert data to binary string */
   /*  var data = new Uint8Array(data);
    var arr = new Array();

    for (var i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
    }

    var bstr = arr.join("");

    return XLSX.read(bstr, {type: "binary"});
} */

// pull out the values we're after, converting it into an array of rowData


    // our data is in the first sheet
    


/* function importExcel() {
    makeRequest('GET',
        'data.xlsx',
        // success
        function (data) {
            
        },
        // error
        function (error) {
            throw error;
        }
    );
} */

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {

    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});
