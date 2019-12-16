const Generator = require('yeoman-generator')
const ejs = require('ejs')
const fs = require('fs').promises

module.exports = class SingleSpaReactGenerator extends Generator {
  async createPackageJson() {
    const answers = await this.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager do you want to use?",
        choices: [
          "yarn",
          "npm",
        ]
      }
    ])

    this.packageManager = answers.packageManager

    const packageJsonTemplate = await fs.readFile(this.templatePath('package.json'), { encoding: "utf-8" })
    const packageJsonStr = ejs.render(packageJsonTemplate, {
      packageManager: answers.packageManager
    })

    this.fs.extendJSON(
      this.destinationPath('package.json'),
      JSON.parse(packageJsonStr)
    )
  }
  async copyOtherFiles() {
    const templateOptions = await this.prompt([
      {
        type: "input",
        name: "orgName",
        message: "Organization name (use lowercase and dashes)",
      },
      {
        type: "input",
        name: "projectName",
        message: "Project name (use lowercase and dashes)",
      }
    ])

    this.fs.copyTpl(
      this.templatePath('jest.config.json'),
      this.destinationPath('jest.config.json'),
      templateOptions
    )
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      templateOptions
    )
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc'),
      templateOptions
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      templateOptions
    )
    this.fs.copyTpl(
      this.templatePath('src/root.component.js'),
      this.destinationPath('src/root.component.js'),
      templateOptions
    )
    this.fs.copyTpl(
      this.templatePath('src/set-public-path.js'),
      this.destinationPath('src/set-public-path.js'),
      templateOptions
    )
    this.fs.copyTpl(
      this.templatePath('src/main.js'),
      this.destinationPath(`src/${templateOptions.orgName}-${templateOptions.projectName}.js`),
      templateOptions
    )
  }
  install() {
    this.installDependencies({
      npm: this.packageManager === 'npm',
      yarn: this.packageManager === 'yarn',
      bower: false,
    })
  }
}