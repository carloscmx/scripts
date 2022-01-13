$('#date_created_invoice').daterangepicker(
{
    locale: {
      format: 'YYYY-MM-DD'
    },
    // startDate: '2013-01-01',
    // endDate: '2013-12-31'
}, 
function(start, end, label) {
    // alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
});

$('#date_due_invoice').daterangepicker(
{
    locale: {
      format: 'YYYY-MM-DD'
    },
    // startDate: '2013-01-01',
    // endDate: '2013-12-31'
}, 
function(start, end, label) {
    // alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
});

function is_enable_check(id){
    return $("#"+id).is(':checked');
}
$(document).ready(function (){
    $("#chkFechaRef").click(function() {
              if (is_enable_check("chkFechaRef")) {
        $( "#date_created_invoice" ).prop( "disabled", false );
    }else{
                $("#date_created_invoice").prop( "disabled", true );

    }
    })
    

});
$(document).ready(function (){
    $("#chkFechaRefDue").click(function() {
              if (is_enable_check("chkFechaRefDue")) {
        $( "#date_due_invoice" ).prop( "disabled", false );
    }else{
        $( "#date_due_invoice" ).prop( "disabled", true );

    }
    })
    

});

function download_invoices_filter() {
    
    
    var invoice_date_due= is_enable_check("chkFechaRefDue") ?{init:$("#date_due_invoice").data('daterangepicker').startDate.format('YYYY-MM-D'),end:$("#date_due_invoice").data('daterangepicker').endDate.format('YYYY-MM-D'),enable:true}:{enable:false};
    
    var invoice_created= is_enable_check("chkFechaRef") ? {init:$("#date_created_invoice").data('daterangepicker').startDate.format('YYYY-MM-D'),end:$("#date_created_invoice").data('daterangepicker').endDate.format('YYYY-MM-D'),enable:true}:{enable:false};
    var invoice_status= $("#invoice_status").val();
    const filter_download={invoice_date_due:invoice_date_due,
            invoice_created:invoice_created,
            invoice_status:invoice_status
    };
       // console.log(filter_download,json_invoices);
   const data_filter=JSON.stringify(generate_filter_invoices(filter_download,json_invoices));
          JSONToCSVConvertor(data_filter, "Vehicle Report", true);



}

function generate_filter_invoices(rules,data){
    data_filter=[];
    for(var i=0; i<data.length; i++){
        
        //RULE INVOICE CREATED
        const rules_obj=[];
        const rules_obj_accept=[];
         rules_obj['bool_invoice_created']=false;
        if(rules.invoice_created.enable){
            var init = Date.parse(rules.invoice_created.init);
            var end = Date.parse(rules.invoice_created.end);
            var normalisedDateCreated=Date.parse(data[i].normalisedDateCreated);
            if((normalisedDateCreated <= end && normalisedDateCreated >= init)){
        //FILTRO BUSCADO
            //data_filter[i]=data[i];
                     rules_obj['bool_invoice_created']=true;

            }else{
                //SIN COICIDENCIAS
            }
        }else{
            //ENTRA POR DEFECTO POR NO APLICAR FILTRO
          // data_filter[i]=data[i];
                   rules_obj['bool_invoice_created']=true;


        }
        //ADD RULE
        rules_obj_accept.push(rules_obj['bool_invoice_created']);
        
        //RULE INVOICE DUE
                           rules_obj['bool_invoice_date_due']=false;
           if(rules.invoice_date_due.enable){
            var init = Date.parse(rules.invoice_date_due.init);
            var end = Date.parse(rules.invoice_date_due.end);
            var normalisedDateDue=Date.parse(data[i].normalisedDateDue);
            if((normalisedDateDue <= end && normalisedDateDue >= init)){
        //FILTRO BUSCADO
                                   rules_obj['bool_invoice_date_due']=true;         
            }else{
                //SIN COICIDENCIAS
            }
        }else{
            //ENTRA POR DEFECTO POR NO APLICAR FILTRO
                                   rules_obj['bool_invoice_date_due']=true;

        }
               //ADD RULE
        rules_obj_accept.push(rules_obj['bool_invoice_date_due']);
               //TO STATUS
         rules_obj['bool_invoice_status']=false;
if(data[i].rawstatus.toUpperCase()==rules.invoice_status.toUpperCase() || rules.invoice_status.length==parseInt(0)){
                    rules_obj['bool_invoice_status']=true;
             }
     //ADD RULE
        rules_obj_accept.push(rules_obj['bool_invoice_status']);
    //ALL CHECKS RULES
    var is_rule_success=true;
     for(const value of rules_obj_accept){
        if(!value){
                  
            is_rule_success=false;
        }
    }
     if(is_rule_success){
         data_filter.push(data[i]);
     }
    
   

     }
        return data_filter;

}
