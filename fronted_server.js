document.addEventListener('DOMContentLoaded',async ()=>{
    let money_amount = document.getElementById('money');

    try{
        let response = await fetch('/get_amount');
        let data = await response.json();
        money_amount.textContent = `৳${data.Money}`;
    }
    catch(error)
    {
        money_amount.textContent = "no data found";
    }
})