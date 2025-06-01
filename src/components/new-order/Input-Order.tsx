"use client";
import React from "react";

import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon, TimeIcon } from "@/icons";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";

export default function InputOrder() {
  const options = [
    { value: "instalasi", label: "Instalasi Mesin" },
    { value: "servis", label: "Servis / Perbaikan Mesin" },
    { value: "maintenance", label: "Maintenance Berkala" },
    { value: "modifikasi", label: "Modifikasi / Retrofit Mesin" },
    { value: "konsultasi", label: "Konsultasi Teknik / Audit Mesin" },
    { value: "penggantian_sparepart", label: "Penggantian Sparepart" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected Jasa:", value);
  };

  return (
    <ComponentCard title="Form Order Jasa Mesin">
      <div className="space-y-6">

        <div>
          <Label>Nama Klien</Label>
          <Input type="text" placeholder="Contoh: Budi Santoso" />
        </div>

        <div>
          <Label>Nama Perusahaan</Label>
          <Input type="text" placeholder="Contoh: PT Mesin Hebat" />
        </div>

        <div>
          <Label>Jenis Jasa</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Pilih jenis jasa"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Lokasi Proyek</Label>
          <Input type="text" placeholder="Contoh: Kawasan Industri Jababeka" />
        </div>

        <div>
          <Label>Tanggal Mulai</Label>
          <DatePicker
            id="start-date"
            placeholder="Pilih tanggal mulai"
            onChange={(dates, currentDateString) => {
              console.log("Tanggal Mulai:", currentDateString);
            }}
          />
        </div>

        <div>
          <Label>Jam Mulai</Label>
          <div className="relative">
            <Input
              type="time"
              name="start-time"
              onChange={(e) => console.log("Jam Mulai:", e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Estimasi Biaya (Rp)</Label>
          <Input type="number" placeholder="Contoh: 75000000" />
        </div>

        <div>
          <Label>Catatan Tambahan</Label>
          <Input
            type="text"
            placeholder="Contoh: Butuh teknisi dengan sertifikasi khusus"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
