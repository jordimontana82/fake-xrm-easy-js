#I @"tools\FAKE\tools\"
#r @"tools\FAKE\tools\FakeLib.dll"

open Fake
open Fake.AssemblyInfoFile
open Fake.Git
open Fake.Testing.XUnit2
open System.IO
open Fake.OpenCoverHelper
open Fake.ReportGeneratorHelper
open Fake.FileHelper

let projectName           = "FakeXrmEasy.EdgeProxy"

//Directories
let buildDir              = @".\build"

let folder2011              = @"FakeXrmEasy.EdgeProxy.v2011"
let folder2013              = @"FakeXrmEasy.EdgeProxy.v2013"
let folder2015              = @"FakeXrmEasy.EdgeProxy.v2015"
let folder2016              = @"FakeXrmEasy.EdgeProxy.v2016"
let folder365               = @"FakeXrmEasy.EdgeProxy.v365"
let folder9                 = @"FakeXrmEasy.EdgeProxy.v9"
let folderShared            = @"FakeXrmEasy.EdgeProxy.Shared"


let FakeXrmEasyBuildDir                    = buildDir + @"\" + folder2011
let FakeXrmEasy2013BuildDir                = buildDir + @"\" + folder2013
let FakeXrmEasy2015BuildDir                = buildDir + @"\" + folder2015
let FakeXrmEasy2016BuildDir                = buildDir + @"\" + folder2016
let FakeXrmEasy365BuildDir                 = buildDir + @"\" + folder365
let FakeXrmEasy9BuildDir                   = buildDir + @"\" + folder9
let FakeXrmEasySharedBuildDir              = buildDir + @"\" + folderShared

let testDir              = @".\test"

let FakeXrmEasyTestsBuildDir               = testDir + @"\" + folder2011 + ".Tests"
let FakeXrmEasyTests2013BuildDir           = testDir + @"\" + folder2013 + ".Tests"
let FakeXrmEasyTests2015BuildDir           = testDir + @"\" + folder2015 + ".Tests"
let FakeXrmEasyTests2016BuildDir           = testDir + @"\" + folder2016 + ".Tests"
let FakeXrmEasyTests365BuildDir            = testDir + @"\" + folder365 + ".Tests"
let FakeXrmEasyTests9BuildDir              = testDir + @"\" + folder9 + ".Tests"
let FakeXrmEasyTestsSharedBuildDir         = testDir + @"\" + folderShared + ".Tests"

let deployDir               = @".\Publish"

let FakeXrmEasyDeployDir                    = deployDir + @"\" + folder2011
let FakeXrmEasy2013DeployDir                = deployDir + @"\" + folder2013
let FakeXrmEasy2015DeployDir                = deployDir + @"\" + folder2015
let FakeXrmEasy2016DeployDir                = deployDir + @"\" + folder2016
let FakeXrmEasy365DeployDir                 = deployDir + @"\" + folder365
let FakeXrmEasy9DeployDir                   = deployDir + @"\" + folder9
let FakeXrmEasySharedDeployDir              = deployDir + @"\" + folderShared

let nugetDir                = @".\nuget\"
let nugetDeployDir          = @"[Enter_NuGet_Url]"
let packagesDir             = @".\packages\"

let nuGetCommandLine           = @".\tools\nuget\nuget410.exe"
let mutable previousVersion = "0.0.1"
let mutable version         = "0.0.2" //Copy this into previousVersion before publishing packages...
let mutable build           = buildVersion
let mutable nugetVersion    = version
let mutable asmVersion      = version
let mutable asmInfoVersion  = version
let mutable setupVersion    = ""

let mutable releaseNotes    = "https://github.com/jordimontana82/fake-xrm-easy-js/compare/v" + previousVersion + "...v" + version

let gitbranch = Git.Information.getBranchName "."
let sha = Git.Information.getCurrentHash()

Target "Clean" (fun _ ->
    CleanDirs [buildDir; deployDir]
)

Target "RestorePackages" (fun _ ->
   RestorePackages()
)

Target "BuildVersions" (fun _ ->

    let safeBuildNumber = if not isLocalBuild then build else "0"

    asmVersion      <- version + "." + safeBuildNumber
    asmInfoVersion  <- asmVersion + " - " + gitbranch + " - " + sha

    nugetVersion    <- version + "." + safeBuildNumber
    setupVersion    <- version + "." + safeBuildNumber

    match gitbranch with
        | "master" -> ()
        | "develop" -> (nugetVersion <- nugetVersion + " - " + "beta")
        | _ -> (nugetVersion <- nugetVersion + " - " + gitbranch)

    SetBuildNumber nugetVersion
)
Target "AssemblyInfo" (fun _ ->
    BulkReplaceAssemblyInfoVersions "." (fun f ->
                                              {f with
                                                  AssemblyVersion = asmVersion
                                                  AssemblyFileVersion = asmVersion
                                                  AssemblyInformationalVersion = asmInfoVersion})
)

Target "BuildFakeXrmEasyEdgeProxy" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY") ]
    !! (folder2011 + @"\*.csproj")
      |> MSBuild FakeXrmEasyBuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.2013" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_2013") ]
    !! (folder2013 + @"\*.csproj")
      |> MSBuild FakeXrmEasy2013BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.2015" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_2015") ]
    !! (folder2015 + @"\*.csproj")
      |> MSBuild FakeXrmEasy2015BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.2016" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_2016") ]
    !! (folder2016 + @"\*.csproj")
      |> MSBuild FakeXrmEasy2016BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.365" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_365") ]
    !! (folder365 + @"\*.csproj")
      |> MSBuild FakeXrmEasy365BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.9" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_9") ]
    !! (folder9 + @"\*.csproj")
      |> MSBuild FakeXrmEasy9BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.Tests" (fun _->
    let properties =
        [ ("DefineConstants", "") ]
    !! (folder2011 + @".Tests\*.csproj")
      |> MSBuild FakeXrmEasyTestsBuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.Tests.2013" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_2013") ]
    !! (folder2013 + @".Tests\*.csproj")
      |> MSBuild FakeXrmEasyTests2013BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.Tests.2015" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_2015") ]
    !! (folder2015 + @".Tests\*.csproj")
      |> MSBuild FakeXrmEasyTests2015BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.Tests.2016" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_2016") ]
    !! (folder2016 + @".Tests\*.csproj")
      |> MSBuild FakeXrmEasyTests2016BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.Tests.365" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_365") ]
    !! (folder365 + @".Tests\*.csproj")
      |> MSBuild FakeXrmEasyTests365BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "BuildFakeXrmEasyEdgeProxy.Tests.9" (fun _->
    let properties =
        [ ("DefineConstants", "FAKE_XRM_EASY_9") ]
    !! (folder9 + @".Tests\*.csproj")
      |> MSBuild FakeXrmEasyTests9BuildDir "Rebuild" (properties)
      |> Log "Build - Output: "
)

Target "Test.2011" (fun _ ->
    !! (testDir + @"\" + folder2011 + @".Tests\" + folder2011 + ".Tests.dll")
      |> xUnit2 (fun p -> { p with HtmlOutputPath = Some (testDir @@ "xunit.2011.html") })
)

Target "Test.2013" (fun _ ->
    !! (testDir + @"\" + folder2013 + @".Tests\" + folder2013 + ".Tests.dll")
      |> xUnit2 (fun p -> { p with HtmlOutputPath = Some (testDir @@ "xunit.2013.html") })
)

Target "Test.2015" (fun _ ->
    !! (testDir + @"\" + folder2015 + @".Tests\" + folder2015 + ".Tests.dll")
      |> xUnit2 (fun p -> { p with HtmlOutputPath = Some (testDir @@ "xunit.2015.html") })
)

Target "Test.2016" (fun _ ->
    !! (testDir + @"\" + folder2016 + @".Tests\" + folder2016 + ".Tests.dll")
      |> xUnit2 (fun p -> { p with HtmlOutputPath = Some (testDir @@ "xunit.2016.html") })
)

Target "Test.365" (fun _ ->
    !! (testDir + @"\" + folder365 + @".Tests\" + folder365 + ".Tests.dll")
      |> xUnit2 (fun p -> { p with HtmlOutputPath = Some (testDir @@ "xunit.365.html") })
)

Target "Test.9" (fun _ ->
    !! (testDir + @"\" + folder9 + @".Tests\" + folder9 + ".Tests.dll")
      |> xUnit2 (fun p -> { p with HtmlOutputPath = Some (testDir @@ "xunit.9.html") })
)

Target "NuGet" (fun _ ->
    CreateDir(nugetDir)

    "FakeXrmEasy.EdgeProxy.2011.nuspec"
     |> NuGet (fun p -> 
           {p with  
               Project = "FakeXrmEasy.EdgeProxy"           
               Version = version
               NoPackageAnalysis = true
               ToolPath = nuGetCommandLine                            
               OutputPath = nugetDir
               ReleaseNotes = releaseNotes
               Publish = true })

    "FakeXrmEasy.EdgeProxy.2013.nuspec"
     |> NuGet (fun p -> 
           {p with 
               Project = "FakeXrmEasy.EdgeProxy.v2013"                  
               Version = version
               NoPackageAnalysis = true
               ToolPath = nuGetCommandLine                            
               OutputPath = nugetDir
               ReleaseNotes = releaseNotes
               Publish = true })

    "FakeXrmEasy.EdgeProxy.2015.nuspec"
     |> NuGet (fun p -> 
           {p with
               Project = "FakeXrmEasy.EdgeProxy.v2015"                   
               Version = version
               NoPackageAnalysis = true
               ToolPath = nuGetCommandLine                            
               OutputPath = nugetDir
               ReleaseNotes = releaseNotes
               Publish = true })

    "FakeXrmEasy.EdgeProxy.2016.nuspec"
     |> NuGet (fun p -> 
           {p with     
               Project = "FakeXrmEasy.EdgeProxy.v2016"              
               Version = version
               NoPackageAnalysis = true
               ToolPath = nuGetCommandLine                            
               OutputPath = nugetDir
               ReleaseNotes = releaseNotes
               Publish = true })

    "FakeXrmEasy.EdgeProxy.365.nuspec"
     |> NuGet (fun p -> 
           {p with     
               Project = "FakeXrmEasy.EdgeProxy.v365"           
               Version = version
               NoPackageAnalysis = true
               ToolPath = nuGetCommandLine                            
               OutputPath = nugetDir
               ReleaseNotes = releaseNotes
               Publish = true })

    "FakeXrmEasy.EdgeProxy.9.nuspec"
     |> NuGet (fun p -> 
           {p with     
               Project = "FakeXrmEasy.EdgeProxy.v9"              
               Version = version
               NoPackageAnalysis = true
               ToolPath = nuGetCommandLine                            
               OutputPath = nugetDir
               ReleaseNotes = releaseNotes
               Publish = true })
)

Target "PublishNuGet" (fun _ ->

  let nugetPublishDir = (deployDir + "nuget")
  CreateDir nugetPublishDir

  !! (nugetDir + "*.nupkg") 
     |> Copy nugetPublishDir

  XCopy nugetPublishDir nugetDeployDir 
)

Target "Publish" (fun _ ->
    CreateDir deployDir

    CreateDir FakeXrmEasyDeployDir
    CreateDir FakeXrmEasy2013DeployDir
    CreateDir FakeXrmEasy2015DeployDir
    CreateDir FakeXrmEasy2016DeployDir
    CreateDir FakeXrmEasy365DeployDir
    CreateDir FakeXrmEasy9DeployDir

    !! (FakeXrmEasyBuildDir @@ @"/**/*.* ")
      -- " *.pdb"
        |> CopyTo FakeXrmEasyDeployDir
        
    !! (FakeXrmEasy2013BuildDir @@ @"/**/*.* ")
      -- " *.pdb"
        |> CopyTo FakeXrmEasy2013DeployDir

    !! (FakeXrmEasy2015BuildDir @@ @"/**/*.* ")
      -- " *.pdb"
        |> CopyTo FakeXrmEasy2015DeployDir

    !! (FakeXrmEasy2016BuildDir @@ @"/**/*.* ")
      -- " *.pdb"
        |> CopyTo FakeXrmEasy2016DeployDir

    !! (FakeXrmEasy365BuildDir @@ @"/**/*.* ")
      -- " *.pdb"
        |> CopyTo FakeXrmEasy365DeployDir

    !! (FakeXrmEasy9BuildDir @@ @"/**/*.* ")
      -- " *.pdb"
        |> CopyTo FakeXrmEasy9DeployDir
)

Target "CodeCoverage.2011" (fun _ ->
    OpenCover (fun p -> { p with 
                                TestRunnerExePath = "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe"
                                ExePath = "./packages/OpenCover.4.6.519/tools/OpenCover.Console"
                                Register = RegisterType.RegisterUser
                                WorkingDir = (testDir @@ @"\" + folder2011 + ".Tests")
                                Filter = "+[FakeXrmEasy*]* -[*.Tests*]*"
                                Output = "../coverage.2011.xml"
                        }) (@"\" + folder2011 + ".Tests.dll")
    
)

Target "CodeCoverage.2013" (fun _ ->
    OpenCover (fun p -> { p with 
                                TestRunnerExePath = "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe"
                                ExePath = "./packages/OpenCover.4.6.519/tools/OpenCover.Console"
                                Register = RegisterType.RegisterUser
                                WorkingDir = (testDir @@ @"\" + folder2013 + ".Tests")
                                Filter = "+[FakeXrmEasy*]* -[*.Tests*]*"
                                Output = "../coverage.2013.xml"
                        }) (@"\" + folder2013 + ".Tests.dll")
    
)

Target "CodeCoverage.2015" (fun _ ->
    OpenCover (fun p -> { p with 
                                TestRunnerExePath = "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe"
                                ExePath = "./packages/OpenCover.4.6.519/tools/OpenCover.Console"
                                Register = RegisterType.RegisterUser
                                WorkingDir = (testDir @@ @"\" + folder2015 + ".Tests")
                                Filter = "+[FakeXrmEasy*]* -[*.Tests*]*"
                                Output = "../coverage.2015.xml"
                        }) (@"\" + folder2015 + ".Tests.dll")
    
)

Target "CodeCoverage.2016" (fun _ ->
    OpenCover (fun p -> { p with 
                                TestRunnerExePath = "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe"
                                ExePath = "./packages/OpenCover.4.6.519/tools/OpenCover.Console"
                                Register = RegisterType.RegisterUser
                                WorkingDir = (testDir @@ @"\" + folder2016 + ".Tests")
                                Filter = "+[FakeXrmEasy*]* -[*.Tests*]*"
                                Output = "../coverage.2016.xml"
                        }) (@"\" + folder2016 + ".Tests.dll")
    
)

Target "CodeCoverage.365" (fun _ ->
    OpenCover (fun p -> { p with 
                                TestRunnerExePath = "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe"
                                ExePath = "./packages/OpenCover.4.6.519/tools/OpenCover.Console"
                                Register = RegisterType.RegisterUser
                                WorkingDir = (testDir @@ @"\" + folder365 + ".Tests")
                                Filter = "+[FakeXrmEasy*]* -[*.Tests*]*"
                                Output = "../coverage.365.xml"
                        }) (@"\" + folder365 + ".Tests.dll")
    
)

Target "CodeCoverage.9" (fun _ ->
    OpenCover (fun p -> { p with 
                                TestRunnerExePath = "./packages/xunit.runner.console.2.1.0/tools/xunit.console.exe"
                                ExePath = "./packages/OpenCover.4.6.519/tools/OpenCover.Console"
                                Register = RegisterType.RegisterUser
                                WorkingDir = (testDir @@ @"\" + folder9 + ".Tests")
                                Filter = "+[FakeXrmEasy*]* -[*.Tests*]*"
                                Output = "../coverage.9.xml"
                        }) (@"\" + folder9 + ".Tests.dll")
    
)

Target "ReportCodeCoverage" (fun _ ->
    ReportGenerator (fun p -> { p with 
                                    ExePath = "./packages/ReportGenerator.2.4.5.0/tools/ReportGenerator"
                                    WorkingDir = (testDir @@ @"\" + folder2011 + ".Tests")
                                    TargetDir = "../reports"
                                    ReportTypes = [ReportGeneratorReportType.Html; ReportGeneratorReportType.Badges ]
                               }) [ "..\coverage.2011.xml";  "..\coverage.2013.xml";  "..\coverage.2015.xml";  "..\coverage.2016.xml"; "..\coverage.365.xml"; "..\coverage.9.xml" ]
    
)

Target "ReplaceVersion" (fun _ ->
    RegexReplaceInFileWithEncoding previousVersion version System.Text.Encoding.UTF8 "README.md"
)


"Clean"
  ==> "RestorePackages"
  ==> "BuildVersions"
  ==> "AssemblyInfo"
  ==> "BuildFakeXrmEasyEdgeProxy"
  ==> "BuildFakeXrmEasyEdgeProxy.2013"
  ==> "BuildFakeXrmEasyEdgeProxy.2015"
  ==> "BuildFakeXrmEasyEdgeProxy.2016"
  ==> "BuildFakeXrmEasyEdgeProxy.365"
  ==> "BuildFakeXrmEasyEdgeProxy.9"
  ==> "BuildFakeXrmEasyEdgeProxy.Tests"
  ==> "BuildFakeXrmEasyEdgeProxy.Tests.2013"
  ==> "BuildFakeXrmEasyEdgeProxy.Tests.2015"
  ==> "BuildFakeXrmEasyEdgeProxy.Tests.2016"
  ==> "BuildFakeXrmEasyEdgeProxy.Tests.365"
  ==> "BuildFakeXrmEasyEdgeProxy.Tests.9"
  ==> "Test.2011"
  ==> "Test.2013"
  ==> "Test.2015"
  ==> "Test.2016"
  ==> "Test.365"
  ==> "Test.9"
  ==> "CodeCoverage.2011"
  ==> "CodeCoverage.2013"
  ==> "CodeCoverage.2015"
  ==> "CodeCoverage.2016"
  ==> "CodeCoverage.365"
  ==> "CodeCoverage.9"
  ==> "ReportCodeCoverage"
  ==> "ReplaceVersion"
  ==> "Publish"
  ==> "NuGet"
  ==> "PublishNuGet"


RunTargetOrDefault "NuGet"