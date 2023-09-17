let DWTChromeExtension = {
  DWObject: undefined,
  load: function () {
    const resourcesURL = document.getElementById("dwt").getAttribute("resourcesURL");
    Dynamsoft.DWT.ResourcesPath = resourcesURL;
    this.initDWT();
  },
  scan: function () {
    if (!this.DWObject) return console.log("DWT not ready");

    this.DWObject.IfShowUI = false;
    this.DWObject.SelectSourceByIndex(0);
    this.DWObject.OpenSource();
    this.DWObject.AcquireImage();
    this.DWObject.CloseSource();

    this.DWObject.ConvertToBlob(
      [0],
      Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF,
      function (result, indices, type) {
        chrome.runtime.sendMessage({ message: "scan_done", pdf: result });
      },
      function (errorCode, errorString) {
        console.log(errorString);
      }
    );
  },
  initDWT: function () {
    Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", () => {
      console.log("DWT ready");
      this.DWObject = Dynamsoft.DWT.GetWebTwain();
    });
    Dynamsoft.DWT.Load();
  },
};

DWTChromeExtension.load();
