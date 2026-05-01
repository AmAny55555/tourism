"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  addTravelField,
  createTravelCountry,
  deleteTravelField,
  fieldTypeLabels,
  getAdminTravelCountries,
  TravelField,
} from "@/lib/api/admin-travel";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  Image as ImageIcon,
  Info,
  Layers3,
  ListChecks,
  Loader2,
  Mail,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

type FieldFormState = {
  label: string;
  name: string;
  type: TravelField["type"];
  optionsText: string;
  is_required: boolean;
  sort_order: number;
};

const emptyFieldForm: FieldFormState = {
  label: "",
  name: "",
  type: "text",
  optionsText: "",
  is_required: true,
  sort_order: 0,
};

function getFieldIcon(type: TravelField["type"]) {
  if (type === "email") return Mail;
  if (type === "phone") return Phone;
  if (type === "date") return CalendarDays;
  if (type === "file") return UploadCloud;
  if (type === "select") return ListChecks;
  if (type === "textarea") return FileText;
  return User;
}

function getErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.errors?.name?.[0] ||
    error?.response?.data?.message ||
    fallback
  );
}

export default function AdminTravelCountriesPage() {
  const queryClient = useQueryClient();
  const { lang, t } = useLanguage();

  const isAr = lang === "ar";
  const text = t.admin.travelCountriesPage;

  const fieldTypes: { value: TravelField["type"]; label: string }[] = [
    { value: "text", label: text.fieldTypes.text },
    { value: "email", label: text.fieldTypes.email },
    { value: "phone", label: text.fieldTypes.phone },
    { value: "date", label: text.fieldTypes.date },
    { value: "select", label: text.fieldTypes.select },
    { value: "file", label: text.fieldTypes.file },
    { value: "textarea", label: text.fieldTypes.textarea },
  ];

  const emiratesFields: Omit<TravelField, "id" | "travel_country_id">[] = [
    {
      label: text.emiratesTemplate.fields.nationality,
      name: "nationality",
      type: "select",
      options: text.emiratesTemplate.options.nationalities,
      is_required: true,
      sort_order: 1,
    },
    {
      label: text.emiratesTemplate.fields.arrivalEmirate,
      name: "arrival_emirate",
      type: "select",
      options: text.emiratesTemplate.options.emirates,
      is_required: true,
      sort_order: 2,
    },
    {
      label: text.emiratesTemplate.fields.travelDate,
      name: "travel_date",
      type: "date",
      options: null,
      is_required: true,
      sort_order: 3,
    },
    {
      label: text.emiratesTemplate.fields.travelFrom,
      name: "travel_from",
      type: "select",
      options: text.emiratesTemplate.options.travelFrom,
      is_required: true,
      sort_order: 4,
    },
    {
      label: text.emiratesTemplate.fields.passportNumber,
      name: "passport_number",
      type: "text",
      options: null,
      is_required: true,
      sort_order: 5,
    },
    {
      label: text.emiratesTemplate.fields.job,
      name: "job",
      type: "text",
      options: null,
      is_required: true,
      sort_order: 6,
    },
    {
      label: text.emiratesTemplate.fields.passportExpiryDate,
      name: "passport_expiry_date",
      type: "date",
      options: null,
      is_required: true,
      sort_order: 7,
    },
    {
      label: text.emiratesTemplate.fields.fullName,
      name: "full_name",
      type: "text",
      options: null,
      is_required: true,
      sort_order: 8,
    },
    {
      label: text.emiratesTemplate.fields.email,
      name: "email",
      type: "email",
      options: null,
      is_required: true,
      sort_order: 9,
    },
    {
      label: text.emiratesTemplate.fields.phone,
      name: "phone",
      type: "phone",
      options: null,
      is_required: true,
      sort_order: 10,
    },
    {
      label: text.emiratesTemplate.fields.faceImage,
      name: "face_image",
      type: "file",
      options: null,
      is_required: true,
      sort_order: 11,
    },
    {
      label: text.emiratesTemplate.fields.passportCopy,
      name: "passport_copy",
      type: "file",
      options: null,
      is_required: true,
      sort_order: 12,
    },
    {
      label: text.emiratesTemplate.fields.passportCover,
      name: "passport_cover",
      type: "file",
      options: null,
      is_required: true,
      sort_order: 13,
    },
    {
      label: text.emiratesTemplate.fields.nationalId,
      name: "national_id",
      type: "file",
      options: null,
      is_required: true,
      sort_order: 14,
    },
    {
      label: text.emiratesTemplate.fields.bankStatement,
      name: "bank_statement",
      type: "file",
      options: null,
      is_required: true,
      sort_order: 15,
    },
    {
      label: text.emiratesTemplate.fields.policeCertificate,
      name: "police_certificate",
      type: "file",
      options: null,
      is_required: true,
      sort_order: 16,
    },
    {
      label: text.emiratesTemplate.fields.extraDocument,
      name: "extra_document_1",
      type: "file",
      options: null,
      is_required: false,
      sort_order: 17,
    },
  ];

  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );

  const [countryForm, setCountryForm] = useState({
    name: "",
    image: "",
    is_active: true,
  });

  const [fieldForm, setFieldForm] = useState<FieldFormState>(emptyFieldForm);
  const [addingTemplate, setAddingTemplate] = useState(false);

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["admin-travel-countries"],
    queryFn: getAdminTravelCountries,
  });

  const selectedCountry = useMemo(() => {
    return (
      countries.find((country) => country.id === selectedCountryId) ||
      countries[0] ||
      null
    );
  }, [countries, selectedCountryId]);

  const sortedFields = useMemo(() => {
    return [...(selectedCountry?.fields || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }, [selectedCountry]);

  const createCountryMutation = useMutation({
    mutationFn: createTravelCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-travel-countries"] });
      setCountryForm({ name: "", image: "", is_active: true });

      Swal.fire({
        icon: "success",
        title: text.alerts.countryAdded,
        confirmButtonColor: "#c99b2e",
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: getErrorMessage(error, text.alerts.countryAddError),
        confirmButtonColor: "#c99b2e",
      });
    },
  });

  const addFieldMutation = useMutation({
    mutationFn: addTravelField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-travel-countries"] });
      setFieldForm(emptyFieldForm);

      Swal.fire({
        icon: "success",
        title: text.alerts.fieldAdded,
        confirmButtonColor: "#c99b2e",
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: getErrorMessage(error, text.alerts.fieldAddError),
        confirmButtonColor: "#c99b2e",
      });
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: deleteTravelField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-travel-countries"] });

      Swal.fire({
        icon: "success",
        title: text.alerts.fieldDeleted,
        confirmButtonColor: "#c99b2e",
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: getErrorMessage(error, text.alerts.fieldDeleteError),
        confirmButtonColor: "#c99b2e",
      });
    },
  });

  const handleCreateCountry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!countryForm.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: text.alerts.enterCountryName,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    createCountryMutation.mutate({
      name: countryForm.name.trim(),
      image: countryForm.image.trim() || undefined,
      is_active: countryForm.is_active,
    });
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry) {
      Swal.fire({
        icon: "warning",
        title: text.alerts.addCountryFirst,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    if (!fieldForm.label.trim() || !fieldForm.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: text.alerts.enterFieldData,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    const options =
      fieldForm.type === "select"
        ? fieldForm.optionsText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : null;

    if (fieldForm.type === "select" && (!options || options.length === 0)) {
      Swal.fire({
        icon: "warning",
        title: text.alerts.enterOptions,
        text: text.alerts.optionsExample,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    addFieldMutation.mutate({
      countryId: selectedCountry.id,
      data: {
        label: fieldForm.label.trim(),
        name: fieldForm.name.trim(),
        type: fieldForm.type,
        options,
        is_required: fieldForm.is_required,
        sort_order: Number(fieldForm.sort_order) || sortedFields.length + 1,
      },
    });
  };

  const handleAddEmiratesTemplate = async () => {
    if (!selectedCountry) {
      Swal.fire({
        icon: "warning",
        title: text.alerts.selectCountryFirst,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    const existingNames = new Set(
      selectedCountry.fields.map((field) => field.name)
    );

    const fieldsToAdd = emiratesFields.filter(
      (field) => !existingNames.has(field.name)
    );

    if (fieldsToAdd.length === 0) {
      Swal.fire({
        icon: "info",
        title: text.alerts.emiratesTemplateExists,
        text: text.alerts.allFieldsAlreadyAdded,
        confirmButtonColor: "#c99b2e",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: `${text.alerts.addEmiratesTemplateTo} ${selectedCountry.name}?`,
      text: `${text.alerts.willAdd} ${fieldsToAdd.length} ${text.alerts.fieldsWithoutDuplicates}`,
      showCancelButton: true,
      confirmButtonText: text.common.add,
      cancelButtonText: text.common.cancel,
      confirmButtonColor: "#c99b2e",
    });

    if (!result.isConfirmed) return;

    try {
      setAddingTemplate(true);

      for (const field of fieldsToAdd) {
        await addTravelField({
          countryId: selectedCountry.id,
          data: field,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["admin-travel-countries"],
      });

      Swal.fire({
        icon: "success",
        title: text.alerts.emiratesTemplateAdded,
        confirmButtonColor: "#c99b2e",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: getErrorMessage(error, text.alerts.templateAddError),
        confirmButtonColor: "#c99b2e",
      });
    } finally {
      setAddingTemplate(false);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: text.alerts.deleteFieldTitle,
      text: text.alerts.deleteFieldText,
      showCancelButton: true,
      confirmButtonText: text.common.delete,
      cancelButtonText: text.common.cancel,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#c99b2e",
    });

    if (result.isConfirmed) {
      deleteFieldMutation.mutate(fieldId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#f5ead2] border-t-[#c99b2e]" />
          <p className="text-sm font-black text-[#667085]">
            {text.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="space-y-6 px-3 pb-10 sm:px-0 lg:space-y-8"
    >
      <section className="relative overflow-hidden rounded-[28px] border border-[#ead7ad] bg-gradient-to-l from-[#f3e7c9] via-white to-[#fffaf0] p-5 shadow-sm sm:rounded-[36px] sm:p-8 lg:p-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c99b2e]/20 blur-3xl" />
        <div className="absolute -bottom-24 right-16 h-72 w-72 rounded-full bg-[#06142b]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c99b2e]/30 bg-white/80 px-4 py-2 text-xs font-black text-[#c99b2e] sm:px-5 sm:text-sm">
              <Globe2 size={17} />
              {text.hero.badge}
            </span>

            <h1 className="text-2xl font-black text-[#06142b] sm:text-4xl lg:text-5xl">
              {text.hero.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#667085] sm:text-base">
              {text.hero.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatsCard value={countries.length} label={text.stats.countries} />
            <StatsCard
              value={countries.reduce(
                (total, country) => total + (country.fields?.length || 0),
                0
              )}
              label={text.stats.fields}
            />
            <StatsCard
              value={countries.filter((country) => country.is_active).length}
              label={text.stats.active}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <div className="space-y-6">
          <form
            onSubmit={handleCreateCountry}
            className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6"
          >
            <SectionTitle
              icon={<Plus />}
              title={text.countryForm.title}
              desc={text.countryForm.description}
            />

            <div className="space-y-4">
              <InputGroup
                label={text.countryForm.nameLabel}
                hint={text.countryForm.nameHint}
              >
                <input
                  value={countryForm.name}
                  onChange={(e) =>
                    setCountryForm({ ...countryForm, name: e.target.value })
                  }
                  className="admin-input"
                  placeholder={text.countryForm.namePlaceholder}
                />
              </InputGroup>

              <InputGroup
                label={text.countryForm.imageLabel}
                hint={text.countryForm.imageHint}
              >
                <div className="relative">
                  <ImageIcon
                    size={18}
                    className={`absolute top-1/2 -translate-y-1/2 text-[#c99b2e] ${
                      isAr ? "right-4" : "left-4"
                    }`}
                  />
                  <input
                    value={countryForm.image}
                    onChange={(e) =>
                      setCountryForm({
                        ...countryForm,
                        image: e.target.value,
                      })
                    }
                    className={`admin-input ${isAr ? "pr-11" : "pl-11"}`}
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>
              </InputGroup>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#ead7ad] bg-[#fcfaf6] px-5 py-4 font-bold text-[#06142b]">
                <input
                  type="checkbox"
                  checked={countryForm.is_active}
                  onChange={(e) =>
                    setCountryForm({
                      ...countryForm,
                      is_active: e.target.checked,
                    })
                  }
                />
                {text.countryForm.activeLabel}
              </label>

              <button
                type="submit"
                disabled={createCountryMutation.isPending}
                className="primary-btn w-full"
              >
                {createCountryMutation.isPending && (
                  <Loader2 className="animate-spin" size={18} />
                )}
                {createCountryMutation.isPending
                  ? text.common.adding
                  : text.countryForm.submit}
              </button>
            </div>
          </form>

          <div className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
            <h2 className="mb-4 text-2xl font-black text-[#06142b]">
              {text.countriesList.title}
            </h2>

            {countries.length === 0 ? (
              <p className="rounded-2xl bg-[#fcfaf6] p-5 text-center font-bold text-[#667085]">
                {text.countriesList.empty}
              </p>
            ) : (
              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {countries.map((country) => (
                  <button
                    type="button"
                    key={country.id}
                    onClick={() => setSelectedCountryId(country.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 font-black transition ${
                      isAr ? "text-right" : "text-left"
                    } ${
                      selectedCountry?.id === country.id
                        ? "bg-[#c99b2e] text-white shadow-lg shadow-[#c99b2e]/20"
                        : "bg-[#fcfaf6] text-[#06142b] hover:bg-[#f5ead2]"
                    }`}
                  >
                    <span className="break-words">{country.name}</span>

                    <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs">
                      {country.fields?.length || 0} {text.stats.fields}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedCountry ? (
            <>
              <div className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[#06142b] sm:text-3xl">
                      {text.formBuilder.formTitle} {selectedCountry.name}
                    </h2>
                    <p className="mt-1 text-sm font-bold leading-7 text-[#667085]">
                      {text.formBuilder.formDescription}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEmiratesTemplate}
                    disabled={addingTemplate}
                    className="secondary-btn"
                  >
                    {addingTemplate ? (
                      <Loader2 className="animate-spin" size={17} />
                    ) : (
                      <Sparkles size={17} />
                    )}
                    {addingTemplate
                      ? text.common.adding
                      : text.formBuilder.addEmiratesTemplate}
                  </button>
                </div>

                <form
                  onSubmit={handleAddField}
                  className="rounded-[26px] border border-[#ead7ad] bg-[#fcfaf6] p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <ListChecks className="text-[#c99b2e]" />
                    <div>
                      <h3 className="text-xl font-black text-[#06142b]">
                        {text.fieldForm.title}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-[#667085]">
                        {text.fieldForm.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputGroup
                      label={text.fieldForm.labelLabel}
                      hint={text.fieldForm.labelHint}
                    >
                      <input
                        value={fieldForm.label}
                        onChange={(e) =>
                          setFieldForm({
                            ...fieldForm,
                            label: e.target.value,
                          })
                        }
                        className="admin-input bg-white"
                        placeholder={text.fieldForm.labelPlaceholder}
                      />
                    </InputGroup>

                    <InputGroup
                      label={text.fieldForm.nameLabel}
                      hint={text.fieldForm.nameHint}
                    >
                      <input
                        value={fieldForm.name}
                        onChange={(e) =>
                          setFieldForm({
                            ...fieldForm,
                            name: e.target.value,
                          })
                        }
                        className="admin-input bg-white"
                        placeholder="nationality"
                        dir="ltr"
                      />
                    </InputGroup>

                    <InputGroup
                      label={text.fieldForm.typeLabel}
                      hint={text.fieldForm.typeHint}
                    >
                      <select
                        value={fieldForm.type}
                        onChange={(e) =>
                          setFieldForm({
                            ...fieldForm,
                            type: e.target.value as TravelField["type"],
                          })
                        }
                        className="admin-input bg-white"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>

                    <InputGroup
                      label={text.fieldForm.orderLabel}
                      hint={text.fieldForm.orderHint}
                    >
                      <input
                        type="number"
                        value={fieldForm.sort_order}
                        onChange={(e) =>
                          setFieldForm({
                            ...fieldForm,
                            sort_order: Number(e.target.value),
                          })
                        }
                        className="admin-input bg-white"
                        placeholder="1"
                      />
                    </InputGroup>

                    {fieldForm.type === "select" && (
                      <div className="md:col-span-2">
                        <InputGroup
                          label={text.fieldForm.optionsLabel}
                          hint={text.fieldForm.optionsHint}
                        >
                          <input
                            value={fieldForm.optionsText}
                            onChange={(e) =>
                              setFieldForm({
                                ...fieldForm,
                                optionsText: e.target.value,
                              })
                            }
                            className="admin-input bg-white"
                            placeholder={text.fieldForm.optionsPlaceholder}
                          />
                        </InputGroup>
                      </div>
                    )}

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ead7ad] bg-white px-5 py-4 font-bold text-[#06142b] md:col-span-2">
                      <input
                        type="checkbox"
                        checked={fieldForm.is_required}
                        onChange={(e) =>
                          setFieldForm({
                            ...fieldForm,
                            is_required: e.target.checked,
                          })
                        }
                        className="mt-1"
                      />
                      <span>
                        {text.fieldForm.requiredLabel}
                        <small className="mt-1 block text-xs font-bold leading-6 text-[#667085]">
                          {text.fieldForm.requiredHint}
                        </small>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={addFieldMutation.isPending}
                    className="primary-btn mt-5"
                  >
                    {addFieldMutation.isPending && (
                      <Loader2 className="animate-spin" size={18} />
                    )}
                    {addFieldMutation.isPending
                      ? text.common.adding
                      : text.fieldForm.submit}
                  </button>
                </form>
              </div>

              <section className="grid gap-6 2xl:grid-cols-[1fr_430px]">
                <div className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#06142b]">
                        {text.currentFields.title}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-[#667085]">
                        {text.currentFields.description}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#f5ead2] px-4 py-2 text-sm font-black text-[#c99b2e]">
                      {sortedFields.length} {text.currentFields.question}
                    </span>
                  </div>

                  {sortedFields.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-[#ead7ad] bg-[#fcfaf6] p-10 text-center">
                      <FileText
                        className="mx-auto mb-3 text-[#c99b2e]"
                        size={32}
                      />
                      <p className="font-black text-[#06142b]">
                        {text.currentFields.empty}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {sortedFields.map((field) => {
                        const Icon = getFieldIcon(field.type);

                        return (
                          <div
                            key={field.id}
                            className="flex flex-col gap-3 rounded-[22px] border border-[#ead7ad] bg-[#fcfaf6] p-4 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#c99b2e]">
                                <Icon size={19} />
                              </div>

                              <div>
                                <h4 className="font-black text-[#06142b]">
                                  {field.label}
                                  {field.is_required && (
                                    <span className="mx-2 text-red-500">*</span>
                                  )}
                                </h4>

                                <p className="mt-1 text-sm font-bold text-[#667085]">
                                  {text.currentFields.type}:{" "}
                                  {fieldTypeLabels[field.type]} —{" "}
                                  {text.currentFields.order}: {field.sort_order}
                                </p>

                                <p className="mt-1 text-xs font-bold text-[#98a2b3]">
                                  {text.currentFields.systemName}: {field.name}
                                </p>

                                {field.options && field.options.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {field.options.map((option) => (
                                      <span
                                        key={option}
                                        className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#667085]"
                                      >
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteField(field.id)}
                              disabled={deleteFieldMutation.isPending}
                              className="flex w-fit items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 size={16} />
                              {text.common.delete}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-[28px] border border-[#ead7ad] bg-white p-5 shadow-sm sm:rounded-[30px] sm:p-6">
                  <SectionTitle
                    icon={<Layers3 />}
                    title={text.preview.title}
                    desc={text.preview.description}
                  />

                  <div className="space-y-4 rounded-[26px] bg-[#fcfaf6] p-4">
                    {sortedFields.length === 0 ? (
                      <p className="py-10 text-center font-black text-[#667085]">
                        {text.preview.empty}
                      </p>
                    ) : (
                      sortedFields.map((field) => (
                        <div key={field.id}>
                          <label className="mb-2 block text-sm font-black text-[#06142b]">
                            {field.label}
                            {field.is_required && (
                              <span className="mx-1 text-red-500">*</span>
                            )}
                          </label>

                          {field.type === "select" ? (
                            <select className="preview-input">
                              <option>{text.preview.selectPlaceholder}</option>
                              {field.options?.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === "textarea" ? (
                            <textarea
                              className="min-h-28 w-full rounded-2xl border border-[#ead7ad] bg-white px-4 py-3 outline-none"
                              placeholder={field.label}
                            />
                          ) : field.type === "file" ? (
                            <div className="rounded-2xl border border-dashed border-[#c99b2e] bg-white p-5 text-center">
                              <UploadCloud
                                className="mx-auto mb-2 text-[#c99b2e]"
                                size={28}
                              />
                              <p className="text-sm font-black text-[#06142b]">
                                {text.preview.fileTitle}
                              </p>
                              <p className="mt-1 text-xs font-bold text-[#667085]">
                                {text.preview.fileSubtitle}
                              </p>
                            </div>
                          ) : (
                            <input
                              type={field.type === "phone" ? "tel" : field.type}
                              className="preview-input"
                              placeholder={field.label}
                            />
                          )}
                        </div>
                      ))
                    )}

                    {sortedFields.length > 0 && (
                      <button
                        type="button"
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#c99b2e] px-6 py-4 font-black text-white"
                      >
                        <CheckCircle2 size={18} />
                        {text.preview.submit}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-[30px] border border-dashed border-[#ead7ad] bg-white p-10 text-center">
              <p className="font-black text-[#667085]">
                {text.noCountrySelected}
              </p>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          min-height: 56px;
          border-radius: 18px;
          border: 1px solid #ead7ad;
          background: #fcfaf6;
          padding: 14px 18px;
          font-weight: 700;
          color: #06142b;
          outline: none;
          transition: 0.2s ease;
        }

        .admin-input:focus {
          border-color: #c99b2e;
          box-shadow: 0 0 0 3px rgba(201, 155, 46, 0.13);
        }

        .preview-input {
          height: 52px;
          width: 100%;
          border-radius: 18px;
          border: 1px solid #ead7ad;
          background: white;
          padding: 0 16px;
          outline: none;
        }

        .primary-btn {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          background: #c99b2e;
          padding: 12px 28px;
          font-weight: 900;
          color: white;
          transition: 0.2s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          background: #b88a22;
        }

        .primary-btn:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        .secondary-btn {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          background: #06142b;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 900;
          color: #f4c542;
          transition: 0.2s ease;
        }

        .secondary-btn:hover {
          transform: translateY(-2px);
        }

        .secondary-btn:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .primary-btn,
          .secondary-btn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

function StatsCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-3xl border border-[#ead7ad] bg-white/80 px-3 py-4 text-center sm:px-5">
      <p className="text-xl font-black text-[#06142b] sm:text-2xl">{value}</p>
      <p className="text-xs font-black text-[#667085]">{label}</p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5ead2] text-[#c99b2e]">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-black text-[#06142b] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-[#667085]">
          {desc}
        </p>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#06142b]">
        {label}
      </label>

      {children}

      <p className="mt-2 flex items-start gap-1 text-xs font-bold leading-5 text-[#667085]">
        <Info size={13} className="mt-0.5 shrink-0 text-[#c99b2e]" />
        {hint}
      </p>
    </div>
  );
}