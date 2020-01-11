var moment = require('moment')
moment.locale('pt-br');

export default {

    formatDate(dia, formato) {
      formato = formato || "DD/MM/YYYY"
      return dia ? moment(dia).format(formato) : ""
    },


    // Converte data no formato YYYY-MM-DD para DD/MM/YYYY
    formatDateDbToBr(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    
    // Converte data no formato DDMMYYYY em YYYY-MM-DD
    formatDateBrNoMaskToDb(st){
      if (!st){
        return null
      }
      var pattern = /(\d{2})(\d{2})(\d{4})/;
      var retorno = st.replace(pattern,'$3-$2-$1');
      return retorno;
    },

    diaSemana(dia){
      return moment(dia).format("ddd")
    },
  
    getIndiceData(data){
      return moment(data).format("e")
    },

    hoje(formato){
      //return moment().format("YYYY-MM-DD")
      formato = formato || "YYYY-MM-DD"
      return moment().format(formato)
    },

    semanaAnterior(data){
      return moment(data).add(-7, "days").format("YYYY-MM-DD")
    },

    semanaSeguinte(data){
      return moment(data).add(1, "days").format("YYYY-MM-DD")
    },
  
    primeiroDiaMesAtual(){
      return moment().startOf('month').format("YYYY-MM-DD")
    },

    ultimoDiaMesAtual(){
      return moment().endOf('month').format("YYYY-MM-DD")
    },

    primeiroDiaMesAnterior(){
      const dataMesPassado =  moment().startOf('month').add(-1,"days")
      return moment(dataMesPassado).startOf('month').format("YYYY-MM-DD")
    },

    ultimoDiaMesAnterior(){
      const dataMesPassado =  moment().startOf('month').add(-1,"days")
      return moment(dataMesPassado).endOf('month').format("YYYY-MM-DD")
    },



}

/* 
exemplosMoment(){

  https://tableless.com.br/trabalhando-com-moment/

  const dia = moment("2018-25-02")
  moment("abcxyz").isValid() // false
  moment("2018-02-24").add(2, "days") // 2018-02-26
  moment("2018-02-24").add(1, "year").subtract("1", "days") // 2019-02-23

  moment().format("dd/MM/yyyy HH-mm") // 25/02/2018 13-35
  moment("abcxyz").format('YYYY MM DD') // "Invalid date"

  moment('2017-10-20').isBefore('2017-10-21'); // true
  moment('2017-10-20').isBefore('2010-12-31', 'year'); // false
  moment('2017-10-20').isBefore('2018-01-01', 'year'); // true

  moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'); // true
}
*/
