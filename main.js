const MODULE_ID = `particle-pandemonium`;

Hooks.once('setup', registerModuleSettings);

Hooks.once("init", async function() {

});


Hooks.on("renderTileConfig", (app, html, data) => {
	html = html[0] ?? html;

	//create new tab
	html.querySelector(`.sheet-tabs`).insertAdjacentHTML("beforeend", `
	<a class="item" data-tab="particle">
	<i class="fa-solid fa-cauldron"></i>
	</i>Particles</a>
	`);

	const enableCheckbox = app.document.getFlag(MODULE_ID, "enable") ? "checked" : "";
	const modeSelector = app.document.getFlag(MODULE_ID, "mode") || 0
	const maxDisplacement = 0
	const parallaxFactor = 0
	const lockX = app.document.getFlag(MODULE_ID, "lockX") ? "checked" : "";
	const lockY = app.document.getFlag(MODULE_ID, "lockY") ? "checked" : "";


	//create tab content
	html.querySelector(`.sheet-footer`).insertAdjacentHTML("beforebegin", `
	<div class="tab" data-tab="particle">
		<p class="notes">Parallax-Tile Options Here.</p>
		<div class="form-group">
			<label>Enable Parallax Tile</label>
			<div class="form-fields">
				<input type="checkbox" name="flags.${MODULE_ID}.enable" ${enableCheckbox}>
			</div>
		</div>

		<div class="form-group">
			<label>Parallax Mode</label>
			<div class="form-fields">
			<select name="flags.${MODULE_ID}.mode" data-dtype="Number">
				<option value="0" ${modeSelector==0 ? "selected":""}>Mesh Mode</option>
				<option value="1" ${modeSelector==1 ? "selected":""}>Texture Mode</option>
			</select>
			</div>
			<p class="hint">Mesh Mode: The tiles mesh moves realitive to the canvis.</p>
			<p class="hint">Texture Mode: The tiles mesh stays still, but the texture movies. Requires seemless texture for best effect</p>
		</div>

		<div class="form-group">
			<label>Max Displacement</label>
			<div class="form-fields">
				<input type="number" step="any" name="flags.${MODULE_ID}.maxDisplacement" value="${maxDisplacement}" placeholder="${0}">
			</div>
			<p class="hint">The maximum value in pixels that the token can be displaced from its origin. (Default to scene grid size)</p>
		</div>	

		<div class="form-group">
			<label>Parallax Factor</label>
			<div class="form-fields">
				<input type="text" step="0.1" name="flags.${MODULE_ID}.parallaxFactor" value="${parallaxFactor}" placeholder="${0}">
			</div>
			<p class="hint">Equation for determining the strength of the parallax in respect to the relative positions canvas.\nFor example you may enter <code>@elevation * 0.1</code> which will use 1/10th of the tiles elevation value for the Parallax Factor.</p>
		</div>

		<div class="form-group">
			<label>Lock Axis: <strong>X</strong></label>
			<div class="form-fields">
				<input type="checkbox" name="flags.${MODULE_ID}.lockX" ${lockX}>
			</div>
		</div>	
		<div class="form-group">
			<label>Lock Axis: <strong>Y</strong></label>
			<div class="form-fields">
				<input type="checkbox" name="flags.${MODULE_ID}.lockY" ${lockY}>
			</div>
		</div>	
	</div>		
	`);

});


function registerModuleSettings() {

}