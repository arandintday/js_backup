// ==UserScript==
// @namespace https://dotennin.blogspot.com/
// @name 百度网盘直链提取（多选）
// @description 百度网盘直链提取（多选）配合IDM下载
// @version 1.2.1
// @author Dotennin
// @license MIT
// @compatible        chrome 测试通过
// @compatible        firefox 未测试
// @compatible        opera 未测试
// @compatible        safari 未测试
// @include https://pan.baidu.com/disk/*
// @include https://yun.baidu.com/disk/*
// @include https://pan.baidu.com/s/*
// @include https://yun.baidu.com/s/*
// @connect baidu.com
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @grant GM_cookie
// @run-at document-idle
// ==/UserScript==

let bdss = ''
;(function($) {
  'use strict'
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }
  function binlMD5(x, len) {
    x[len >> 5] |= 0x80 << len % 32
    x[(((len + 64) >>> 9) << 4) + 14] = len
    let i
    let olda
    let oldb
    let oldc
    let oldd
    let a = 1732584193
    let b = -271733879
    let c = -1732584194
    let d = 271733878
    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d
      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)
      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)
      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }
  function binl2rstr(input) {
    let i
    let output = ''
    const length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff)
    }
    return output
  }
  function rstr2binl(input) {
    let i
    const output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    const length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32
    }
    return output
  }
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }
  function rstrHMACMD5(key, data) {
    let i
    let bkey = rstr2binl(key)
    const ipad = []
    const opad = []
    let hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }
  function rstr2hex(input) {
    const hexTab = '0123456789abcdef'
    let output = ''
    let x
    let i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input))
  }
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5(s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }
  function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
})(this)

!(function() {
  initState()
})()

const ui = (function() {
  const ui = unsafeWindow.require('system-core:context/context.js').instanceForSystem.ui
  const dialog = unsafeWindow.require('system-core:system/uiService/dialog/dialog.js')
  let isTipAvailable = false
  return {
    tip: (msg = '生成链接中...') => {
      ui.tip({ autoClose: false, mode: 'loading', msg })
      isTipAvailable = true
    },
    hideTip: () => {
      ui.hideTip()
      isTipAvailable = false
    },
    isTipAvailable: () => isTipAvailable,
    confirm: (onSure, onCancel) => {
      return dialog.confirm({
        title: '是否取消正在获取的链接',
        body: `是否取消正在获取的链接？`,
        onSure,
        onCancel,
      })
    },
  }
})()

function encodeBase64(bytes) {
  if (bytes === undefined || bytes === null) {
    return ''
  }
  if (bytes instanceof Array) {
    bytes = bytes.filter((item) => {
      return Number.isFinite(item) && item >= 0 && item <= 255
    })
  }

  if (!(bytes instanceof Uint8Array || bytes instanceof Uint8ClampedArray || bytes instanceof Array)) {
    if (typeof bytes === 'string') {
      const str = bytes
      bytes = Array.from(unescape(encodeURIComponent(str))).map((ch) => ch.codePointAt(0))
    } else {
      throw new TypeError('bytes must be of type Uint8Array or String.')
    }
  }

  const keys = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+',
    '/',
  ]
  const fillKey = '='

  let byte1
  let byte2
  let byte3
  let sign1 = ' '
  let sign2 = ' '
  let sign3 = ' '
  let sign4 = ' '

  let result = ''

  for (let index = 0; index < bytes.length; ) {
    let fillUpAt = 0

    // tslint:disable:no-increment-decrement
    byte1 = bytes[index++]
    byte2 = bytes[index++]
    byte3 = bytes[index++]

    if (byte2 === undefined) {
      byte2 = 0
      fillUpAt = 2
    }

    if (byte3 === undefined) {
      byte3 = 0
      if (!fillUpAt) {
        fillUpAt = 3
      }
    }

    // tslint:disable:no-bitwise
    sign1 = keys[byte1 >> 2]
    sign2 = keys[((byte1 & 0x3) << 4) + (byte2 >> 4)]
    sign3 = keys[((byte2 & 0xf) << 2) + (byte3 >> 6)]
    sign4 = keys[byte3 & 0x3f]

    if (fillUpAt > 0) {
      if (fillUpAt <= 2) {
        sign3 = fillKey
      }
      if (fillUpAt <= 3) {
        sign4 = fillKey
      }
    }

    result += sign1 + sign2 + sign3 + sign4

    if (fillUpAt) {
      break
    }
  }

  return result
}

function onNavigationChange() {
  const isShareMode = location.href.includes('baidu.com/s/')
  const task = setInterval(() => {
    if (
      isShareMode ||
      unsafeWindow.require('system-core:context/context.js').instanceForSystem.list.getCurrentList().length > 0
    ) {
      clearInterval(task)

      // 让小的下载按扭显示出来后加以触发事件
      unsafeWindow
        .jQuery('.g-clearfix')
        .mouseover()
        .mouseleave()

      const targets = document.querySelectorAll("a.g-button[data-button-id][title^='下载']")
      targets.forEach((t) => {
        const dom = t.cloneNode(true)
        t.after(dom)
        dom.removeAttribute('style')
        t.remove()
        dom.addEventListener('click', (e) => {
          e.stopPropagation()
          if (isShareMode) {
            dialogAlert(
              `需要先「保存到我的百度网盘」后<br />在网盘列表(<a target="_blank" href="https://pan.baidu.com/disk/home">https://pan.baidu.com/disk/home</a>)中下载`
            )
            return
          }

          //从列表中点击下载按键的时候， 如果没有自动勾选，就手动点击勾选。
          const checkInput = e.target.closest('dd') && e.target.closest('dd').querySelector('span')
          if (
            checkInput &&
            checkInput.querySelector('span .icon') &&
            checkInput.querySelector('span .icon').offsetHeight === 0
          ) {
            checkInput.click()
          }

          const dom = window.event.currentTarget
          dom.setAttribute('style', 'background-color: #09e; color: #fff')

          openModal()
          ui.tip()
          createRequestList().then((requestList) => {
            Promise.all(requestList).then((res) => {
              ui.hideTip()
              document.getElementById('python-code').href =
                'data:text/plain;;base64,' + encodeBase64(pyScriptCreator(res))
              document.getElementById('python-code').className = ''
              document.getElementById('bat-code').href = 'data:text/plain;base64,' + encodeBase64(batScriptCreator(res))
              document.getElementById('bat-code').className = ''
              dom.removeAttribute('style')
              document.querySelector('#copy-code').className = ''
            })
          })
        })
      })
    }
  }, 1e3)
}
const task = () => {
  setInterval(() => {}, 100)
}

function itemPathCreator(item) {
  const currentCacheKey = getcurrentCacheKey()
  return item.path
    .replace(currentCacheKey + currentCacheKey !== '/' ? '/' : '', '')
    .replace(/\//g, '\\')
    .replace('\\' + item.server_filename, '')
}

function pyScriptCreator(res) {
  const loopOutPutFiles = (res) => {
    let text = ''
    res.forEach((item) => {
      return (text += `
down_url = r"""${item.url}"""
down_path = down_root_path + r"""\\${itemPathCreator(item)}"""
output_filename = r"""${item.server_filename}"""
subprocess.call([IDM, '/d',down_url, '/p',down_path, '/f', output_filename, '/n', '/a', '/s'])
      `)
    })
    return text
  }
  return `import subprocess
__idm_location_shell = r"""for /f "tokens=1,2,* " %i in ('REG QUERY HKEY_CURRENT_USER\\Software\\DownloadManager /v ExePath ^| find /i "ExePath"') do @echo %k"""
__down_root_path__shell = r"""echo %USERPROFILE%\\Downloads"""
IDM = str(subprocess.check_output(__idm_location_shell, shell=True)).replace('b\\'', '').replace('\\\\r\\\\n\\'', '')
down_root_path = str(subprocess.check_output(__down_root_path__shell, shell=True)).replace('b\\'', '').replace('\\\\r\\\\n\\'', '').replace('\\\\\\\\', '\\\\')
subprocess.call(IDM)
${loopOutPutFiles(res)}
  `
}

function batScriptCreator(res) {
  const loopOutPutFiles = (res) => {
    let text = ''
    res.forEach((item) => {
      return (text += `
"%IDM%" /d "${item.url}" /p %DOWNLOAD_PATH%\\${itemPathCreator(item)} /f ${item.server_filename} /n /a
      `)
    })
    return text
  }
  return `@echo off
chcp 65001
for /f "tokens=1,2,* " %%i in ('REG QUERY HKEY_CURRENT_USER\\Software\\DownloadManager /v ExePath ^| find /i "ExePath"') do set "IDM=%%k"
set DOWNLOAD_PATH=%USERPROFILE%\\Downloads

echo IDM PATH:      %IDM%
echo DOWNLOAD PATH: %DOWNLOAD_PATH%

${loopOutPutFiles(res)}

echo Load completed, press any key to exit
pause>null
  `
}

function dialogAlert(message) {
  unsafeWindow.require('system-core:system/uiService/dialog/dialog.js').alert(message)
}

function getCacheData(arr) {
  return new Promise((resolve) => {
    const { cache } = unsafeWindow.require('system-core:context/context.js').instanceForSystem.getList()
    const currentKey = cache.key
    cache.key = arr.path
    cache.getCacheData(-1, (list) => {
      resolve(list)
      // 恢复默认key值
      cache.key = currentKey
    })
  })
}

function getcurrentCacheKey() {
  return unsafeWindow.require('system-core:context/context.js').instanceForSystem.getList().cache.key
}

function createRequestList() {
  const getItemsFromDir = async (arr) => {
    const requestList = []
    const createGenerator = async function*(arr) {
      const itemList = await getCacheData(arr)
      yield itemList
      for (const childItem of itemList) {
        if (childItem.isdir === 1) {
          const nextGenerator = createGenerator(childItem)
          let next = await nextGenerator.next()
          while (next && !next.done) {
            yield next
            next = (await nextGenerator.next()).value
          }
        }
      }
    }
    const generator = createGenerator(arr)
    let next = await generator.next()
    while (next && !next.done) {
      requestList.push(next.value.filter((item) => item.isdir === 0))
      next = (await generator.next()).value
    }
    return requestList
  }

  const getDownloadUrl = (arr) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url:
          'http://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&ver=4.0&method=locatedownload&path=' +
          encodeURIComponent(arr.path) +
          '&devuid=O|' +
          bdss +
          '&to=d0',
        method: 'GET',
        responseType: 'json',
        headers: {
          'User-Agent': 'netdisk',
        },
        onload: (r) => {
          if (r.response.hasOwnProperty('client_ip')) {
            arr.url = r.response.urls[0].url + '&filename=' + encodeURIComponent(arr.server_filename)
            document.querySelector('.code').insertAdjacentHTML('beforeend', arr.url + '\n')
            resolve(arr)
          } else {
            // Todo return error message
            reject(r)
          }
        },
      })
    })
  }
  const requestList = []
  const selectList = unsafeWindow.require('system-core:context/context.js').instanceForSystem.list.getSelected()
  return new Promise((resolve) => {
    selectList.forEach(async (arr, index) => {
      if (arr.path.match(/^\/sharelink\d+/)) {
        dialogAlert(
          `需要先「保存到我的百度网盘」后<br />在网盘列表(<a target="_blank" href="https://pan.baidu.com/disk/home">https://pan.baidu.com/disk/home</a>)中下载`
        )
        return false
      }
      if (arr.isdir === 1) {
        const itemsListsFromDir = await getItemsFromDir(arr)
        itemsListsFromDir.forEach((itemsList) => {
          itemsList.forEach((item) => requestList.push(getDownloadUrl(item)))
        })
      } else {
        requestList.push(getDownloadUrl(arr))
      }
      if (selectList.length - 1 === index) {
        resolve(requestList)
      }
    })
  })
}

function openModal() {
  const modalWrapper = document.querySelector('.modal-wrapper')
  modalWrapper.className = modalWrapper.className + ' open'
}

function closeModal() {
  const call = () => {
    ui.hideTip()
    const modalWrapper = document.querySelector('.modal-wrapper')
    modalWrapper.className = 'modal-wrapper'
    const urlElements = document.querySelector('.code')
    document.querySelector('#copy-code').className = 'disabled'
    document.getElementById('python-code').href = ''
    document.getElementById('python-code').className = 'disabled'
    document.getElementById('bat-code').href = ''
    document.getElementById('bat-code').className = 'disabled'
    urlElements.innerHTML = ''
  }
  if (ui.isTipAvailable()) {
    ui.confirm(call)
    return
  }
  call()
}

function copyCode() {
  const urlElements = document.querySelector('.code')
  window.getSelection().selectAllChildren(urlElements)
  GM_setClipboard(urlElements.innerText, 'text')
}

function initState() {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
        <div class="modal-wrapper">
            <div class="modal-overlay"></div>
            <div class="modal-window">
                <div class="modal-content">
                    <pre class="code" data-lang="" data-unlink=""></pre>
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                      "
                    >
                      <button id="copy-code" class="disabled">复制到剪切板</button>
                      <div
                        style="
                          width: 100%;
                          display: flex;
                          flex-direction: column;
                          align-items: flex-end;
                        "
                      >
                        <a id="python-code" class="disabled" download="idm-download-request.py">生成IDM(.py)下载脚本(<span style="font-size: xx-small">推荐，需要Python执行环境</span>)</a>
                        <a id="bat-code" class="disabled" download="idm-download-request.bat">生成IDM(.bat)下载脚本(<span style="font-size: xx-small">暂不支持中文路径和文件夹</span>)</a>
                      </div>
                    </div>
                </div>
                <span class="modal-close">×</a>
            </div>
        </div>
    <style>
        .modal-wrapper {
            z-index: 50;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            text-align: center;
            display: flex;
            justify-content: center;

            opacity: 0;
            visibility: hidden;
            transition: opacity .3s, visibility .3s;
        }

        .modal-wrapper.open {
            opacity: 1;
            visibility: visible;
            transition: opacity .4s, visibility .4s;
        }

        .modal-wrapper::after {
            display: inline-block;
            height: 100%;
            margin-left: -.05em;
            vertical-align: middle;
            content: ""
        }

        .modal-wrapper .modal-window {
            box-sizing: border-box;
            display: inline-block;
            z-index: 20;
            position: relative;
            width: 60vw;
            padding: 30px 30px 15px;
            border-radius: 2px;
            background: #fff;
            box-shadow: 0 0 30px rgba(0, 0, 0, .6);
            vertical-align: middle;
            align-self: center;
        }

        .modal-wrapper .modal-window .modal-content {
            max-height: 60vh;
            overflow-y: auto;
        }

        .modal-overlay {
            z-index: 10;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, .8)
        }

        .modal-wrapper .modal-close {
            z-index: 20;
            position: absolute;
            top: 0;
            right: 0;
            width: 35px;
            color: #95979c!important;
            font-size: 20px;
            font-weight: 700;
            line-height: 35px;
            text-align: center;
            text-decoration: none;
            text-indent: 0
        }

        .modal-wrapper .modal-close:hover {
            color: #2b2e38!important
        }
        pre.code {
            text-align: left;
            background: rgb(250, 250, 250);
            border-radius: 3px;
            border: 0px;
            box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 5px inset;
            color: #4d4d4d;
            font-family: Monaco, Consolas, "Courier New", Courier, monospace, sans-serif;
            font-size: 13px;
            outline: 0px;
            overflow: auto;
            max-height: 55vh;
            padding: 10px;
            vertical-align: baseline;
            line-height: normal;
        }
        a[title^="下载"] {
            color: #2f912d !important;
        }
        a[title^="下载"] em {
            color: #2f912d !important;
        }
        #copy-code {
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            box-sizing: border-box;
            margin: 0;
            font: inherit;
            font-family: inherit;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            touch-action: manipulation;
            user-select: none;
            border: 1px solid transparent;
            border-radius: 4px;
            color: #fff;
            background-color: #337ab7;
            text-shadow: 0 -1px 0 rgba(0,0,0,.2);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.15),0 1px 1px rgba(0,0,0,.075);
            background-image: linear-gradient(to bottom,#337ab7 0,#265a88 100%);
            background-repeat: repeat-x;
            border-color: #245580;
            -webkit-appearance: button;
            cursor: pointer;
        }
        #copy-code:focus {
            outline: thin dotted;
            outline: 5px auto -webkit-focus-ring-color;
            outline-offset: -2px;
        }
        #copy-code:active {
            background-color: #265a88;
            border-color: #245580;
        }
        #copy-code:hover {
            background-color: #265a88;
            background-position: 0 -15px;
        }
    </style>
    `
  )

  document.querySelectorAll('.modal-overlay,.modal-close').forEach((e) => e.addEventListener('click', closeModal))
  document.getElementById('copy-code').addEventListener('click', copyCode)
  onNavigationChange()
  unsafeWindow.require('base:widget/hash/hash.js').listen('path', onNavigationChange)

  GM_cookie.list({ domain: 'baidu.com' }, function(cookies, error) {
    if (!error) {
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].name == 'BDUSS') {
          bdss = cookies[i].value
        }
      }
    } else {
      bdss = md5('')
    }

    console.log(bdss)
  })
}
