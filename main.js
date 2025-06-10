"use strict";
    // TAB NAVIGATION
    function openTab(evt, tabName) {
      let tabcontents = document.getElementsByClassName("tabcontent");
      for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
        tabcontents[i].classList.remove("active");
      }
      let tablinks = document.getElementsByClassName("tablinks");
      for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
      }
      document.getElementById(tabName).style.display = "block";
      document.getElementById(tabName).classList.add("active");
      evt.currentTarget.classList.add("active");
    }
    document.getElementById("defaultTab").click();

    /* ---- CALCULATOR FUNCTIONS ---- */
    // Regular Polygon Calculator
    function calcPolygonAngles() {
      let n = parseInt(document.getElementById("numSides").value);
      let result = document.getElementById("polyCalcResult");
      if (isNaN(n) || n < 3) {
        result.innerHTML = "<p>Please enter a valid integer (n ≥ 3).</p>";
        return;
      }
      let sumInterior = (n - 2) * 180;
      let interior = sumInterior / n;
      let exterior = 360 / n;
      result.innerHTML =
        `<p>For a regular polygon with <strong>${n}</strong> sides:</p>` +
        `<p>Sum of interior angles: <strong>${sumInterior}°</strong></p>` +
        `<p>Each interior angle: <strong>${interior.toFixed(2)}°</strong></p>` +
        `<p>Each exterior angle: <strong>${exterior.toFixed(2)}°</strong></p>`;
    }

    // Triangle Angle Analyzer (for any triangle—non-regular)
    function analyzeTriangle() {
      let A = parseFloat(document.getElementById("triAngleA").value);
      let B = parseFloat(document.getElementById("triAngleB").value);
      let C = parseFloat(document.getElementById("triAngleC").value);
      let result = document.getElementById("triangleCalcResult");
      if (isNaN(A) || isNaN(B) || isNaN(C)) {
        result.innerHTML = "<p>Please enter valid numbers for all angles.</p>";
        return;
      }
      if (Math.abs(A + B + C - 180) > 0.001) {
        result.innerHTML = "<p>The sum of the interior angles must equal 180°.</p>";
        return;
      }
      let extA = 180 - A;
      let extB = 180 - B;
      let extC = 180 - C;
      
      // Classify: by angle classification (right, obtuse, acute)
      let classification = "";
      if (A === 90 || B === 90 || C === 90) classification = "Right Triangle";
      else if (A > 90 || B > 90 || C > 90) classification = "Obtuse Triangle";
      else classification = "Acute Triangle";

      // Check for equality in angles
      if (Math.abs(A - B) < 0.001 && Math.abs(B - C) < 0.001)
        classification += " (Equilateral)";
      else if (Math.abs(A - B) < 0.001 || Math.abs(A - C) < 0.001 || Math.abs(B - C) < 0.001)
        classification += " (Isosceles)";
      else classification += " (Scalene)";

      result.innerHTML =
          `<p>Interior angles: A = ${A.toFixed(1)}°, B = ${B.toFixed(1)}°, C = ${C.toFixed(1)}°</p>` +
          `<p>Exterior angles: A' = ${extA.toFixed(1)}°, B' = ${extB.toFixed(1)}°, C' = ${extC.toFixed(1)}°</p>` +
          `<p>Triangle classification: <strong>${classification}</strong></p>`;
    }

    /* ---- DIAGRAM FUNCTIONS ---- */
    // Toggle diagram sections based on dropdown selection
    function toggleDiagramSection() {
      let selection = document.getElementById("diagramSelect").value;
      let regSection = document.getElementById("diagramRegular");
      let triSection = document.getElementById("diagramTriangle");
      if (selection === "regular") {
        regSection.classList.add("active");
        triSection.classList.remove("active");
      } else if (selection === "triangle") {
        triSection.classList.add("active");
        regSection.classList.remove("active");
      } else {
        regSection.classList.remove("active");
        triSection.classList.remove("active");
      }
    }

    // Regular Polygon Diagram
    function drawRegularPolygonDiagram() {
      let n = parseInt(document.getElementById("diagPolySides").value);
      let resultDiv = document.getElementById("polyDiagramResult");
      if (isNaN(n) || n < 3) {
        resultDiv.innerHTML = "<p>Please enter a valid integer (n ≥ 3).</p>";
        return;
      }
      let canvas = document.getElementById("polyCanvas");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let centerX = canvas.width / 2, centerY = canvas.height / 2;
      let radius = 150; // fixed radius
      let startAngle = -Math.PI / 2;
      let vertices = [];
      for (let i = 0; i < n; i++) {
        let angle = startAngle + (2 * Math.PI * i / n);
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);
        vertices.push({ x, y });
      }
      ctx.strokeStyle = "#007BFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < n; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      // Compute interior and exterior angles for regular polygon
      let interior = ((n - 2) * 180) / n;
      let exterior = 360 / n;
      // Draw arc at the first vertex to denote the interior angle.
      let arcRadius = 30;
      let angle1 = Math.atan2(vertices[n - 1].y - vertices[0].y, vertices[n - 1].x - vertices[0].x);
      let angle2 = Math.atan2(vertices[1].y - vertices[0].y, vertices[1].x - vertices[0].x);
      if (angle2 < angle1) angle2 += 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(vertices[0].x, vertices[0].y, arcRadius, angle1, angle2);
      ctx.strokeStyle = "#FF5722";
      ctx.stroke();
      // Annotate near vertex 0.
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(`Int: ${interior.toFixed(1)}°`, vertices[0].x + arcRadius + 5, vertices[0].y);
      ctx.fillText(`Ext: ${exterior.toFixed(1)}°`, vertices[0].x + arcRadius + 5, vertices[0].y + 16);
      resultDiv.innerHTML = `<p>Each interior angle: ${interior.toFixed(2)}° | Each exterior angle: ${exterior.toFixed(2)}°</p>`;
    }

    // Triangle Diagram (Custom)
    function drawTriangleDiagram() {
      let A = parseFloat(document.getElementById("diagTriA").value);
      let B = parseFloat(document.getElementById("diagTriB").value);
      let C = parseFloat(document.getElementById("diagTriC").value);
      let resultDiv = document.getElementById("triDiagramResult");
      if (isNaN(A) || isNaN(B) || isNaN(C)) {
        resultDiv.innerHTML = "<p>Please enter valid numbers for all angles.</p>";
        return;
      }
      if (Math.abs(A + B + C - 180) > 0.1) {
        resultDiv.innerHTML = "<p>Internal angles must sum to 180°.</p>";
        return;
      }
      // For a unique (up-to-similarity) triangle, assume side c (between A and B) = 150.
      // Using Law of Sines: c/sin(C) = b/sin(B) => b = c * sin(B)/sin(C)
      // Vertex A at (0,0), B at (150,0). Then, vertex C = (b*cos(A), b*sin(A)), where A in radians.
      let c = 150;
      let radA = A * Math.PI / 180, radB = B * Math.PI / 180, radC = C * Math.PI / 180;
      let b = c * Math.sin(radB) / Math.sin(radC);
      let Ax = 0, Ay = 0;
      let Bx = c, By = 0;
      let Cx = b * Math.cos(radA);
      let Cy = b * Math.sin(radA);
      // Draw triangle on canvas.
      let canvas = document.getElementById("triCanvas");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#007BFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Ax, Ay);
      ctx.lineTo(Bx, By);
      ctx.lineTo(Cx, Cy);
      ctx.closePath();
      ctx.stroke();
      // Compute external angles = 180 - internal.
      let extA = 180 - A, extB = 180 - B, extC = 180 - C;
      // Annotate vertices
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(`A: ${A.toFixed(1)}° | Ext: ${extA.toFixed(1)}°`, Ax - 10, Ay - 10);
      ctx.fillText(`B: ${B.toFixed(1)}° | Ext: ${extB.toFixed(1)}°`, Bx - 50, By - 10);
      ctx.fillText(`C: ${C.toFixed(1)}° | Ext: ${extC.toFixed(1)}°`, Cx, Cy + 20);
      resultDiv.innerHTML = `<p>Internal angles: A = ${A.toFixed(1)}°, B = ${B.toFixed(1)}°, C = ${C.toFixed(1)}°</p>
                             <p>Exterior angles: A = ${extA.toFixed(1)}°, B = ${extB.toFixed(1)}°, C = ${extC.toFixed(1)}°</p>`;
    }
