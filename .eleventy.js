const pluginBetterSlug = require("@borisschapira/eleventy-plugin-better-slug");
const pluginSass = require("eleventy-plugin-sass");

const pluginSassSettings = {
    watch: ['_src/**/*.{scss,sass}', '!node_modules/**']
};

module.exports = (function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("_src/img");
    eleventyConfig.addPassthroughCopy("_src/js");
    eleventyConfig.addPassthroughCopy("_src/css/fonts");

    eleventyConfig.addPlugin(pluginBetterSlug);
    eleventyConfig.addPlugin(pluginSass, pluginSassSettings);

    eleventyConfig.addShortcode("chestParse", function(chestList) {
        return `There are ${chestList.length} total chests in this world.`;
    })

    eleventyConfig.addShortcode("otherCheckParse", function(checkList) {
        let defaultChecks = [];
        let optionalChecks = {};
        for (const check of checkList) {
            const enabledBy = check.enabledBy;
            if (enabledBy == 'Default') {
                defaultChecks.push(check);
            } else if (optionalChecks.hasOwnProperty(enabledBy)) {
                optionalChecks[enabledBy].push(check);
            } else {
                optionalChecks[enabledBy] = [check];
            }
        }

        let output = `By default, there are ${defaultChecks.length} other checks--they are as follows:`;
        for (const check of defaultChecks) {
            output += `\n* ${check.description} (${check.type})`;
        }

        for (const enabledBy in optionalChecks) {
            const checks = optionalChecks[enabledBy];
            const s = (checks.length == 1) ? "" : "s";
            output += `\n\nIf the ${enabledBy} checks are enabled, ${checks.length} additional check${s} could be important:`;
            for (const check of checks) {
                output += `\n* ${check.description} (${check.type})`;
            }
        }

        return output;
    })

    eleventyConfig.addShortcode("levelCheckIdTable", function(levels) {
        let output = `| Level | Sword    | Shield   | Staff    |\n`;
        output += `|:-----:|:--------:|:--------:|:--------:|\n`;

        for (const level of levels) {
            output += `| ${level.level.toString().padEnd(6, " ")}`;
            output += `| ${level.swordId} `;
            output += `| ${level.shieldId} `;
            output += `| ${level.staffId} |\n`
        }
        return output;
    })

    return {
        dir: {
            input: "_src"
        }
    };
});