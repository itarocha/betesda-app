import petraDateTime from '../petra-date-time';

export function host (url) {
    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const parts = host.split('.').slice(-3)
    if (parts[0] === 'www') parts.shift()
    return parts.join('.')
  }
  
  export function timeAgo (time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
      return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
      return pluralize(~~(between / 3600), ' hour')
    } else {
      return pluralize(~~(between / 86400), ' day')
    }
  }
  
  function pluralize (time, label) {
    if (time === 1) {
      return time + label
    }
    return time + label + 's'
  }


export function fmtData(value){
    return petraDateTime.formatDate(value, 'DD/MM/YYYY') || "---"
}

export function fmtTipoUtilizacao(tipo){
    return tipo == "T" ? "Total" : "Parcial"
}

export function fmtCep(value){
	var re = /^([\d]{5})([\d]{3})/

	if (re.test(value)){
		return value.replace(re,"$1-$2")
	} else {
		return value
	}
}

export function fmtCNPJ(value){
	var re = /^([\d]{2})([\d]{3})([\d]{3})([\d]{4})([\d]{2})/

	if (re.test(value)){
		return value.replace(re,"$1.$2.$3/$4-$5")
	} else {
		return value
	}
}

export function fmtCPF(value){
	var re = /^([\d]{3})([\d]{3})([\d]{3})([\d]{2})/

	if (re.test(value)){
		return value.replace(re,"$1.$2.$3-$4")
	} else {
		return value
	}
}
