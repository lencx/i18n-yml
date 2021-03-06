// {lang}/page | page.{lang}
const mode = '{lang}/page'
const i18nType = ['i18n-c', 'i18n-k', 'i18n-p', 'i18n-s']

window.addEventListener('load', () => {
    hasI18n()
    let langBtn = document.querySelectorAll('[i18n-lang-btn]')
    Array.from(langBtn).some(i => {
        // console.log(i.getAttribute('i18n-lang-btn'))
        i.addEventListener('click', () => {
            window.localStorage.setItem('LxI18nLang', i.getAttribute('i18n-lang-btn'))
            hasI18n()
        })
    })
})

function hasI18n() {
    let _uri = getPath()
    // console.log(getPath())
    if(!(_uri==='')) {
        let lang = window.localStorage.getItem('LxI18nLang')
        const i18nURL = `/i18n/${getPath().replace('{lang}', lang)}.json`
        // console.log(i18nURL)
    
        i18nType.some(i => {
            let _el = document.querySelectorAll(`[${i}]`)
            if(_el.length>0) {
                switch(i) {
                    case 'i18n-p':
                        // console.log(_uri)
                        if(!(_uri === 'p')) {
                            fetchData({
                                url: i18nURL,
                                type: 'i18n-p',
                                el: _el,
                                cb: data => {
                                    i18nImg('i18n-p-i', data)
                                    i18nPlaceholder('i18n-p-ph', data)
                                }
                            })
                        }
                        break
                    case 'i18n-c':
                        fetchData({
                            url: `/i18n/glob/common.${lang}.json`,
                            type: 'i18n-c',
                            el: _el,
                            cb: data => {
                                i18nImg('i18n-c-i', data)
                                i18nPlaceholder('i18n-c-ph', data)
                            }
                        })
                        break
                    case 'i18n-k':
                        fetchData({
                            url: `/i18n/glob/keyword.${lang}.json`,
                            type: 'i18n-k',
                            el: _el,
                            cb: data => i18nPlaceholder('i18n-k-ph', data)
                        })
                        break
                    case 'i18n-s':
                        Array.from(_el).some(j => {
                            j.classList.remove('i18n-cn', 'i18n-en')
                            j.classList.add(`i18n-${lang}`)
                        })
                        break
                    default:
                        break
                }
            }
    
        })
    }
}

function fetchData(opts) {
    var init = {
        method: 'GET',
        headers: new Headers().append('Content-Type', 'application/json'),
        mode: 'cors',
        cache: 'default' 
    }
    fetch(opts.url, init)
        .then(res => res.json())
        .then(data => {
            Array.from(opts.el).some(j => j.innerHTML = data[j.getAttribute(opts.type)]),
            opts.cb ? opts.cb(data) : ''
        }, err => {
            console.log('%c Not `i18n` page please set: %c <meta i18n-unset> ', 'background: yellow; color: #000; font-size: 18px;', 'background: #fff; color: red; font-weight: bold; font-size: 18px;')
            console.log('%c meta attribute: %c i18n-uset | i18n-uset=\'p\'', 'font-size: 18px; font-weight: bold;', 'background: #fff; color: green; font-size: 18px; font-weight: bold;')
        })
}

function i18nImg(type, data) {
    Array.from(document.querySelectorAll(`[${type}]`)).some(j => j.setAttribute('src', data[j.getAttribute(type)]))
}

function i18nPlaceholder(type, data) {
    Array.from(document.querySelectorAll(`[${type}]`)).some(j => j.setAttribute('placeholder', data[j.getAttribute(type)]))
}

function getPath() {
    let i18nPath = document.querySelector('[i18n-path]')
    let setI18n = document.querySelector('[i18n-unset]')
    let _path = i18nPath !== null
        ? i18nPath.attributes['i18n-path'].value
        : setI18n === null
            ? mode.replace('/page', location.pathname.split('.')[0])
            : setI18n.getAttribute('i18n-unset')

    // _path = _path.replace('{lang}', 'cn')
    _path = /\/$/.test(_path) ? `${_path}index` : _path
    return _path
}
