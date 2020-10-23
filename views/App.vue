<template lang="pug">
  .columns
    .column
      .box
        MonacoEditor(theme="vs-dark" language="C" height="800px", width="800px" :value="coding" :editorMounted="fct" @change="onChange")
    .column
      .box
        p(style="margin-top:30px") Les arguments si il faut:
        input.textarea(v-model="input")
        p(style="margin-top:30px") Output du programme:
        .box.note {{output}}
        div(style="margin-top:30px")
          button( class="button" v-on:click="submit()") Compiler son code:
          b-checkbox(v-model="inputRadio" style="margin-top:10px;margin-left:20px")
            p Besoin d'arguments ?
          p(style="margin-top:20px") Nombre d'utilisateurs: {{number}}
</template>

<script lang="ts">

import Vue from 'vue'
import MonacoEditor from 'monaco-editor-vue';
import axios from 'axios'
import io from 'socket.io-client'

export default Vue.extend({
  components: {
    MonacoEditor,
  },
  data () {
    return {
      coding: "",
      input: "",
      inputRadio: false,
      output: "",
      socket: io('https://codetogetheronline.herokuapp.com'),
      number: 0
    }
  },
  name: 'app',
  methods: {
    async submit() {
      try {
        let test = await axios.post('/',
          {code: this.coding,
          input: this.input,
          inputRadio: this.inputRadio });
          this.output = ReplaceNewLines(test.data);
          this.sendOutput();
      } catch (err) {
        console.log(err);
      }
    },
    async sendMessage(e: any) {
      console.log(e)
      console.log(this.coding)
      this.socket.emit('SEND_MESSAGE', {
        message: this.coding
      });
    },
    async sendOutput() {
      this.socket.emit('SEND_OUTPUT', {
        output: this.output
      })
    },
    async sendInputRadio() {
      this.socket.emit('SEND_INPUTRADIO', {
        inputRadio: this.inputRadio
      })
    },
    async fct(e: any) {
      await e.onKeyUp(() => {
        this.sendMessage(this.coding);
      })
    },
    async onChange(value: string) {
      this.coding = value;
    },
    async sendInput() {
      this.socket.emit('SEND_INPUT', {
        input: this.input
      })
    }
  },
  async mounted() {
    let data = await axios.get('/coding');
    this.coding = data.data.text;
    this.output = data.data.output;
    this.input = data.data.input;
    this.inputRadio = data.data.inputRadio
    await this.socket.on('MESSAGE', (data: any) => {
      this.coding = data.message;
    })
    await this.socket.on('USERS', (data: any) => {
      this.number = data
    })
    await this.socket.on('OUTPUT', (data: any) => {
      this.output = data.output
    })
    await this.socket.on('INPUTRADIO', (data: any) => {
      this.inputRadio = data.inputRadio
    })
    await this.socket.on('INPUT', (data: any) => {
      this.input = data.input;
    })
  },
  watch: {
    inputRadio() {
      this.sendInputRadio();
    },
    input() {
      this.sendInput();
    }
  }
})

function ReplaceNewLines(input: string) {
  return input.replace(/\r?\n/g, '\n');
}

</script>

<style lang="scss" scoped>

.note {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}

</style>
