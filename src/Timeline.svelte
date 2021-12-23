<script>
    export let data;
    export let step;

    let dates = data.map(d => new Date(d.date))

    let firstDate = dates[0]
    let lastDate = dates[dates.length -1]

    let distDate = lastDate.getTime() - firstDate.getTime()
    let datesPos = dates.map(d => (d.getTime() - firstDate.getTime())/distDate)

    // let date = new Date(time);
    console.log("date", lastDate, firstDate, distDate, dates.map(d => d.getTime()), datesPos)
</script>

<div class="timeline-wrapper">
    <div class="timeline">
        {#each datesPos as date}
        <div class="point" style="left:{date*100}%"></div>
        {/each}
    </div>
    <div class="date">
        {dates[step]}
    </div>
</div>

<style>
    .timeline-wrapper{
        padding:0 25px;
    }
    .timeline {
        width:100%;
        height:5px;
        margin:5px 0;
        position:relative;
    }
    .point {
        display:block;
        width:5px;
        height:5px;
        background:rgba(24, 155, 255, 0.4);
        position:absolute;
    }
</style>