
/*

*/

//executes when DOM is loaded
$( document ).ready(function() {
    
    //select deom elements with "setFilepath" class and add onClick functionality
    //this opens talks to the main process through the namespace "BRIDGE"
    $(".setFilePath").on("click", ()=>{
        BRIDGE.setFilePath();
    });
});