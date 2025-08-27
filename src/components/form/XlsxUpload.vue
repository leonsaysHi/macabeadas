<template>
  <div class="d-flex align-items-end gap-2">
    <InputComp
      v-model="f"
      type="file"
      accept=".xlsx,.xls"
      placeholder="Choose a file or drop it here..."
      :disabled="props.disabled"
      @change="handleSelect"
    ></InputComp>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';
import InputComp from '@/components/form/InputComp.vue';
import { ref } from 'vue';
interface IProps {
  modelValue?: [] | object;
  disabled?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const emit = defineEmits(['parsed']);
const f = ref();
const handleSelect = (ev: Event) => {
  const file = ev.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    // Get the binary data
    const data = e.target.result;

    // Convert the data to a workbook
    const workbook = XLSX.read(data, { type: 'binary', cellDates: true });

    // Get the first sheet
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Do something with the JSON data
    emit('parsed', jsonData);
  };

  // Read the data as binary
  reader.readAsBinaryString(file);
};
</script>
