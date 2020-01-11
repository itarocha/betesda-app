<template>
  <div class="hello">
    <el-row type="flex" :gutter="20" class="row-bg" justify="center">
      <el-col :sm="24" :md="18" :lg="12">

        <div class="grid-content">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-position="left"
            size="small"
            label-width="140px"
          >
            <el-form-item label="Nome" prop="nome">
              <el-input v-model="ruleForm.nome" @input.native="fmtMaiusculas($event, 'nome')"></el-input>
            </el-form-item>

            <el-form-item label="RG:" prop="rg">
              <el-input v-model="ruleForm.rg" @input.native="fmtLetrasENumeros($event, 'rg')"></el-input>
            </el-form-item>

            <el-form-item label="CPF:" prop="cpf">
              <el-input v-model="ruleForm.cpf" v-mask="'###.###.###-##'" :masked="true"></el-input>
            </el-form-item>

            <el-form-item label="Activity zone" prop="region">
              <el-select v-model="ruleForm.region" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai"></el-option>
                <el-option label="Zone two" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Activity date" required>
              <el-col :span="10">
                <el-form-item prop="date1">
                  <el-date-picker
                    type="date"
                    placeholder="Pick a date"
                    v-model="ruleForm.date1"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="Instant delivery" prop="delivery">
              <el-switch v-model="ruleForm.delivery"></el-switch>
            </el-form-item>

            <el-form-item label="Activity type" prop="type">
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox label="Online activities" name="type"></el-checkbox>
                <el-checkbox label="Promotion activities" name="type"></el-checkbox>
                <el-checkbox label="Offline activities" name="type"></el-checkbox>
                <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="Resources" prop="resource">
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="Sponsorship"></el-radio>
                <el-radio label="Venue"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Activity form" prop="desc">
              <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">Teste</el-button>
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!--
    <el-tabs type="border-card">
      <el-tab-pane label="User">User</el-tab-pane>
      <el-tab-pane label="Config">Config</el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">
        <el-button type="primary" @click="openMessageBox">MessageBox</el-button>
      </el-tab-pane>
    </el-tabs>
    -->
  </div>
</template>

<script>
import {mask} from 'vue-the-mask'

export default {
  name: "Teste",

  directives: {mask},

  mounted(){
    this.$store.dispatch('setAcao','Teste')
  },


  data() {
    return {
      ruleForm: {
        nome: "",
        rg: "",
        cpf:"",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        nome: [
          { required: true, message: "Preencha o nome",trigger: "blur"},
          { min: 3, max: 64, message: "Nome deve haver de 3 a 64 caracteres",trigger: "blur"}
        ],
        rg: [
          { required: true, message: "Preencha a RG",trigger: "blur"},
          { min: 6, max: 32, message: "RG deve haver de 6 a 32 caracteres",trigger: "blur"}
        ],
        region: [
          {
            required: true,
            message: "Please select Activity zone",
            trigger: "change"
          }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "Please pick a date",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "Please pick a time",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "Please select at least one activity type",
            trigger: "change"
          }
        ],
        resource: [
          {
            required: true,
            message: "Please select activity resource",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please input activity form",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    
    fmtMaiusculas(event, campo){
      this.$data["ruleForm"][campo] = petra.removerAcentos(event.target.value).toUpperCase()
    },

    fmtLetrasENumeros(event, campo){
      this.$data["ruleForm"][campo] = petra.letrasENumeros(event.target.value).toUpperCase()
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openMessageBox() {
        this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });          
        });
      }    
  }
};
</script>

<style scoped>

.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>