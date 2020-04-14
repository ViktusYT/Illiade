import fs from 'fs-extra'
import Pickr from '@simonwep/pickr'
import { ListFormat } from 'typescript'

/**
 * DNA Class that is responsible
 * for dna editor regarding the UI
 */
class DNA {
    constructor() {
        this.element = $('#dna')
        this.bg = $('#dna #dna-bg')
        this.cont = $('#dna #dna-bg .container')
        this.busy = false
        this.parseMenu()
    }

    on() {
        this.busy = true
        this.element.style.visibility = 'visible'
        setTimeout(() => {
            this.element.style.opacity = '1'
            this.bg.style.opacity = '1'
        }, 200)
    }

    off() {
        this.busy = false
        this.element.style.opacity = '0'
        this.bg.style.opacity = '0'
        setTimeout(() => {
            this.element.style.visibility = 'hidden'
        }, 200)
    }

    // Function that returns
    // Settings config for
    // Illiade's dna panel
    menu() {
        return [

            'Sound',

            {
                id: 'ambient-sound',
                name: 'Ambient Sound',
                type: 'switch',
                attach: 'AMBIENT_SOUND',
                trigger() {
                    AMBIENT_SOUND.val = !AMBIENT_SOUND.val
                },
                update() {
                    if (AMBIENT_SOUND.val) {
                        audioController.audioMaster.set(0.2)
                    }

                    else {
                        audioController.audioMaster.set(0)
                    }
                }
            },

            'Terminal',

            {
                id: 'term-cursor-style',
                name: 'Terminal cursor style',
                type: 'select',
                attach: 'TERM_CURSOR_STYLE',
                options: ['Block', 'Underline', 'Bar'],
                by: 'value',
                trigger(e) {
                    TERM_CURSOR_STYLE.val = e[1]
                },
                update() {
                    for (const term of TERMINALS.val) {
                        if (term == null) continue
                        term.xterm.setOption(
                            'cursorStyle', 
                            TERM_CURSOR_STYLE.val.toLowerCase()
                        )
                    }
                }
            },

            {
                id: 'term-cursor-color',
                name: 'Terminal cursor color',
                type: 'color',
                attach: 'TERM_CURSOR_COLOR',
                default: '#CFB8AB',
                trigger(e) {
                    TERM_CURSOR_COLOR.val = e
                },
                update(info) {
                    if (info != 'init')
                    $err.done(`Changes will be 
                    visible once killed current 
                    terminal or opened a new one`)
                }
            },

            
            // 'Project File',
            
            // {
            //     id: 'save-project-config',
            //     name: 'Save config of this project to a file',
            //     type: 'switch',
            //     attach: 'SAVE_PROJECT_CONFIG',
            //     trigger() {
            //         SAVE_PROJECT_CONFIG.val = !SAVE_PROJECT_CONFIG.val
            //     },
            //     update: updateProjectConfig
            // },

            'Illiade\'s Vibe',

            {
                id: 'boot-animation',
                name: 'Startup Rich Animation',
                type: 'switch',
                attach: 'BOOT_ANIMATION',
                trigger() {
                    BOOT_ANIMATION.val = !BOOT_ANIMATION.val
                },
                update() {}
            },

            {
                id: 'boot-animation-type',
                name: 'Startup Animation Type',
                type: 'select',
                attach: 'BOOT_ANIMATION_TYPE',
                options: ['Silk', 'Papyrus', 'Feather'],
                by: 'index',
                trigger(e) {
                    BOOT_ANIMATION_TYPE.val = e[0]
                },
                update() {}
            },

            {
                id: 'colorful-jellyfish',
                name: 'Colorful Jellyfish',
                type: 'switch',
                attach: 'COLORFUL_JELLIES',
                trigger() {
                    COLORFUL_JELLIES.val = !COLORFUL_JELLIES.val
                },
                update() {
                    if (COLORFUL_JELLIES.val) {
                        $('#bg').style.animation = 'jelly 10s infinite'
                    }
                    else {
                        $('#bg').style.animation = 'none'
                    }
                }
            },

            {
                id: 'background-opacity',
                name: 'Background Opacity',
                attach: 'BG_OPACITY',
                type: 'range',
                range: [0, 0.7, 0.01],
                value: 0.5,
                trigger(val) {
                    BG_OPACITY.val = val
                },
                update() {
                    $('#bg').style.opacity = BG_OPACITY.val
                }
            }
        ]
    }

    parseMenu() {
        let obj = this.menu()
        for(const item of obj) {
            // If it's a title
            if (typeof item === 'string') {
                // Create a title
                let el = document.createElement('div')
                el.className = 'title'
                el.innerHTML = item
                this.cont.appendChild(el)
            }
            // If it's a setting
            else {
                
                const el = document.createElement('div')
                const name = document.createElement('div')
                const control = document.createElement('div')

                el.className = 'row'
                name.className = 'name'
                name.innerHTML = item.name
                control.className = 'setting'
                el.appendChild(name)
                el.appendChild(control)
                this.cont.appendChild(el)

                // Show stats in the console
                EDITOR_LOAD.trigger(() => console.log(
                    `%c${item.id}: ${window[item.attach].val}`, DEBUGGER_STYLE.val
                ))
                
                // Setting type switch.
                // Contains a boolean value.
                // Can be turned on or off.
                if (item.type === 'switch') {
                    let setting = document.createElement('div')
                    setting.id = item.id
                    setting.className = 'switch'
                    setting.addEventListener('click', item.trigger)
                    control.appendChild(setting)

                    window[item.attach].trigger(value => {
                        setting.classList.toggle('on', value)
                        storage.set(item.attach, value)
                    })

                    window[item.attach].trigger(item.update)
                    window[item.attach].tick(window[item.attach].val)
                    item.update('init')
                }

                // Setting type text.
                // Contains string value.
                // Can be changed to whatever sting desired.
                else if (item.type === 'text') {
                    let setting = document.createElement('input')
                    setting.id = item.id
                    setting.className = 'text'
                    setting.placeholder = item.placeholder || ''
                    setting.value = item.value || ''
                    setting.addEventListener('change', e => {
                        item.trigger(e.target.value)
                    })
                    control.appendChild(setting)
                    
                    window[item.attach].trigger(value => {
                        setting.value = value
                        storage.set(item.attach, value)
                    })

                    window[item.attach].trigger(item.update)
                    window[item.attach].tick(window[item.attach].val)
                    item.update('init')
                }

                // Settings type select.
                // Contains index of selected item and it's label.
                // Can be changed to any other element from the list.
                else if (item.type === 'select') {
                    let setting = document.createElement('div')
                    setting.id = item.id
                    setting.className = 'select'

                    if (!item.options) return $err.spawn(`
                        DNA: 
                        Badly parsed setting of type 'select' of id '${item.id}'
                        Missing option 'options'
                    `)
                    for (const [index, opt] of item.options.entries()) {
                        let el = document.createElement('div')
                        el.className = 'item'
                        
                        el.innerHTML = opt
                        el.setAttribute('index', index)
                        setting.appendChild(el)
                        
                        el.addEventListener('click', e => {
                            item.trigger([e.target.getAttribute('index'), e.target.innerText])
                        })
                    }

                    window[item.attach].trigger(value => {
                        for (const el of setting.children) {
                            el.classList.remove('on')                            
                        }

                        // Get selected item by index
                        if (item.by == 'index') {
                            setting.children[window[item.attach].val].classList.add('on')
                        }

                        // Get selected item by value
                        else if (item.by == 'value') {
                            const index = item.options.indexOf(window[item.attach].val)
                            
                            setting.children[index].classList.add('on')
                        }

                        // If type is unrelated
                        else $err.spawn(`DNA: You must specify are you storing selection by index or by value '${item.attach}'`)
                        storage.set(item.attach, value)
                    })

                    control.appendChild(setting)
                    
                    window[item.attach].trigger(item.update)
                    window[item.attach].tick(window[item.attach].val)
                    item.update('init')                    
                }
                
                // Setting type color picker.
                // Contains color exposed as a string.
                // Can be changed to any other color.
                else if (item.type == 'color') {
                    let setting = document.createElement('div')
                    setting.id = item.id
                    setting.className = 'color'
                    control.appendChild(setting)
                    
                    const pickr = Pickr.create({
                        el: setting,
                        theme: 'nano',
                        default: TERM_CURSOR_COLOR.val,
                        swatches: [
                            item.default
                        ],
                        components: {
                            preview: true,
                            opacity: true,
                            hue: true,
                            interaction: {
                                input: true,
                                save: true
                            }
                        }
                    })
                    pickr.on('save', (color, instance) => {
                        item.trigger(color.toHEXA().toString())
                        item.update()
                    })
                    window[item.attach].trigger(value => {
                        storage.set(item.attach, value)
                    })
                    pickr.setColor(item.default)
                    window[item.attach].tick(window[item.attach].val)
                    item.update('init')
                }

                // Setting type range number selector.
                // Contains range exposed as a number.
                // Can be changed to any number from defined range.
                else if (item.type == 'range') {
                    let setting = document.createElement('input')
                    let gauge = document.createElement('div')
                    setting.id = item.id
                    setting.className = 'range'
                    gauge.className = 'range-gauge'
                    setting.type = 'range'
                    setting.min = item.range[0] || 0
                    setting.max = item.range[1] || 100
                    setting.step = item.range[2] || 1
                    setting.value = item.value || 50
                    gauge.innerHTML = item.value || 50
                    setting.addEventListener('input', e => {
                        gauge.innerHTML = setting.value
                    })
                    setting.addEventListener('change', e => {
                        item.trigger(setting.value)
                    })
                    control.appendChild(setting)
                    control.appendChild(gauge)
                    window[item.attach].trigger(value => {
                        setting.value = value
                        gauge.innerHTML = value
                        storage.set(item.attach, value)
                    })
                    window[item.attach].trigger(item.update)
                    window[item.attach].tick(window[item.attach].val)
                    item.update('init')
                }

                else $err.spawn(`DNA: Bad DNA item type '${item.type}'`)
            }
        }
    }
}

window.dna = new DNA()


window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (menu.busy) return null
        dna.off()
    }
})

