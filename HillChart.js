function SimpleVector(x, y)
{
    this.x = x;
    this.y = y;
}

function PlotPoint(label, x, colour = "")
{
    if (colour == "")
    {
        var newColour = lastColour;
        while (newColour == lastColour)
        {
            newColour = colourScheme[Math.floor(Math.random() * colourScheme.length)];
        }
        lastColour = newColour;
        this.colour = newColour;
    }
    else
    {
        this.colour = colour;
    }
    this.position = new SimpleVector(x, getYPosition(x));
    this.label = label;
    this.selected = false;
    this.moving = false;
    this.markedForDelete = false;
}

var lastColour = "";
var colourScheme = [
    "#EA7186",
    "#F2C79E",
    "#7A77B9",
    "#BD9DEA",
    "#81b7ba",
    "#e64a32",
    "#42b3a4",
    "#2C788D"
];
var canvas = document.getElementById("MainCanvas");

var ctx = canvas.getContext("2d");
var offset = 40;
var curveHeight = canvas.height - offset;
var mousePos = new SimpleVector(0, 0);
var plostPos = new SimpleVector(0, 0);
var radius = 15;
var plotPoints = [];

function getMousePos(mouseEvent)
{
    var rect = canvas.getBoundingClientRect();
    return new SimpleVector(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top);
}

function positionIsOnCurve(pos)
{
    var requiredY = getYPosition(pos.x);
    var hitY = pos.y > requiredY - radius && pos.y < requiredY + radius;
    return hitY;
}

canvas.addEventListener("mousemove", function(evt)
{
    mousePos = getMousePos(evt);
    for (var i = 0; i < plotPoints.length; i++)
    {
        if (plotPoints[i].moving == false)
        {
            continue;
        }
        
        plotPoints[i].position.x = mousePos.x;
        plotPoints[i].position.y = getYPosition(mousePos.x);
    }
}, false);

canvas.addEventListener("mousedown", function(evt)
{
    var pos = getMousePos(evt);
    for (var i = 0; i < plotPoints.length; i++)
    {
        var plot = plotPoints[i];
        var hitX = pos.x > plot.position.x - radius && pos.x < plot.position.x + radius;
        var hitY = pos.y > plot.position.y - radius && pos.y < plot.position.y + radius;
        if (hitX && hitY)
        {
            for (var j = 0; j < plotPoints.length; j++)
            {
                if (i == j)
                {
                    continue;
                }
                plotPoints[j].selected = false;
            }
            plot.moving = true;
            plot.selected = true;
            return;
        }
    }

    for (var i = 0; i < plotPoints.length; i++)
    {
        plotPoints[i].selected = false;
    }

    if (positionIsOnCurve(pos))
    {
        var newPoint = new PlotPoint("");
        newPoint.position.x = pos.x;
        newPoint.position.y = getYPosition(pos.x);
        newPoint.selected = true;
        plotPoints.push(newPoint);
    }
}, false);

canvas.addEventListener("mouseup", function(evt)
{
    for (var i = 0; i < plotPoints.length; i++)
    {
        plotPoints[i].moving = false;
    }
    encodeURL();
    
}, false);

canvas.tabIndex = 1000;
canvas.addEventListener("keydown", function(evt)
{
    for (var i = 0; i < plotPoints.length; i++)
    {
        var point = plotPoints[i];
        if (point.selected == false)
        {
            continue;
        }
        
        if (evt.key == "&" || evt.key == ";")
        {
            // ampersand and semi-colon are reserved for parsing the URL
            return;
        }

        if (evt.keyCode == 13)
        {
            // use "Enter" to de-select and exit text-editing
            point.selected = false;
            encodeURL();
            return;
        }
        if ((evt.keyCode >= 48 && evt.keyCode <= 192) || evt.keyCode == 32)
        {
            point.label += evt.key;
        }
        else
        {
            switch (evt.key)
            {
                case "Backspace":
                    point.label = point.label.substring(0, point.label.length - 1);
                    break;
                case "Delete":
                    point.markedForDelete = true;
                    break;
            }
        }
    }
    encodeURL();
})

function animate() {
    // call again next time we can draw
    requestAnimationFrame(animate);
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointsToDelete = [];
    for(var i = 0; i < plotPoints.length; i++)
    {
        var point = plotPoints[i];
        if (point.markedForDelete)
        {
            pointsToDelete.push(point);
        }
    }
    for (var i = 0; i < pointsToDelete.length; i++)
    {
        var pointIndex = plotPoints.indexOf(pointsToDelete[i]);
        plotPoints.splice(pointIndex, 1);
    }
    if (pointsToDelete.length > 0)
    {
        encodeURL();
        pointsToDelete = [];
    }
    drawGraph();
  }
  
  function main()
  {
      decodeURL(window.location.hash);
      animate();
  }

function drawGraph()
{
    ctx.lineWidth = 1;

    ctx.fillStyle = "#EBE8E7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offset);
    ctx.lineTo(canvas.width, canvas.height - offset);
    ctx.strokeStyle = "#a0a0a0"
    ctx.stroke();

    var dashHeight = 5;
    ctx.beginPath();
    for (var i = canvas.height - offset; i > canvas.height - curveHeight + dashHeight * 2 - offset; i-=dashHeight * 2)
    {
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i - dashHeight);
    }
    ctx.stroke();

    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("FIGURING THINGS OUT", canvas.width / 2 - 50, canvas.height - offset + 6);
    ctx.fillStyle = "#a0a0a0";
    ctx.fillText("FIGURING THINGS OUT", canvas.width / 2 - 50, canvas.height - offset + 5);
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.fillText("MAKING THINGS HAPPEN", canvas.width / 2 + 50, canvas.height - offset + 6);
    ctx.fillStyle = "#a0a0a0";
    ctx.fillText("MAKING THINGS HAPPEN", canvas.width / 2 + 50, canvas.height - offset + 5);

    ctx.beginPath();
    for(var i = 0; i <= canvas.width; i+=20)
    {
      ctx.lineTo(i, getYPosition(i));
    }
    ctx.strokeStyle = "#000"
    ctx.stroke();
    ctx.closePath();
    
    for (var i = 0; i < plotPoints.length; i++)
    {
        plotPoint(ctx, plotPoints[i]);
    }
}

function getYPosition(xPosition)
{
    var high = canvas.width + canvas.width / 2;
    var low = -canvas.width / 2;
    var progress = ((xPosition / canvas.width) * (high - low) + low) / canvas.width;
    progress *= Math.PI;
    return canvas.height - offset - ((curveHeight - 30) / 2 * Math.sin(progress)) - curveHeight / 2;
    // return (canvas.height - curveHeight / 2 * Math.sin(progress));
}

function plotPoint(ctx, plotPoint)
{
    ctx.beginPath();
    ctx.arc(plotPoint.position.x, plotPoint.position.y, radius, 0, 360);
    ctx.strokeStyle = plotPoint.selected ? "#fff" : "#000";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = plotPoint.colour;
    ctx.fill();
    ctx.closePath();
    ctx.textBaseline = 'middle';
    ctx.font = "24px sans-serif";
    ctx.fillStyle = plotPoint.selected ? plotPoint.colour : "#000";
    if (ctx.measureText(plotPoint.label).width * 2 < canvas.width - plotPoint.position.x)
    {
        ctx.textAlign = 'left';
        ctx.fillText(plotPoint.label, plotPoint.position.x + radius + 5, plotPoint.position.y);
    }
    else
    {
        ctx.textAlign = 'right';
        ctx.fillText(plotPoint.label, plotPoint.position.x - radius - 5, plotPoint.position.y);
    }
}

function encodeURL()
{
    var url = "";
    for (var i = 0; i < plotPoints.length; i++)
    {
        var point = plotPoints[i];
        if (i > 0)
        {
            url += "&";
        }
        url += encodeURI(point.label) + ";" + point.position.x + ";" + point.colour.substring(1).padStart(6, "0");
    }
    window.location = "#/" + url;
    return url;
}

function decodeURL(url)
{
    if (!url || url == "/#")
    {
        return;
    }
    url = url.substring(2);
    var plotPointStrings = url.split("&");
    for (var i = 0; i < plotPointStrings.length; i++)
    {
        var PlotPointString = plotPointStrings[i];
        var dataTokens = PlotPointString.split(";");
        var label = decodeURI(dataTokens[0]);
        var xPos = parseInt(dataTokens[1]);
        var colour = "#" + dataTokens[2].padStart(6, "0");
        var point = new PlotPoint(label, xPos, colour);
        plotPoints.push(point);
    }
}