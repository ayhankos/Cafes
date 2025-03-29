"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import ReactSelect from "react-select";

// City and district types
type District = {
  value: number;
  label: string;
};

type City = {
  value: number;
  label: string;
  districts: District[];
};

const contactTypeSchema = z.object({
  type: z.enum([
    "PHONE",
    "EMAIL",
    "WEBSITE",
    "INSTAGRAM",
    "FACEBOOK",
    "TWITTER",
  ]),
  value: z.string().min(1, { message: "Contact value is required" }),
});

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  district: z.string().min(2, {
    message: "District must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  description: z.string().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  googleMapsEmbedUrl: z.string().url().optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
  contactInfos: z.array(contactTypeSchema),
});

export default function NewCafePage() {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/ililce.json");
        const data = await response.json();

        const formattedCities: City[] = data.map((city: any) => ({
          value: city.value,
          label: city.text,
          districts: city.districts.map((district: any) => ({
            value: district.value,
            label: district.text,
          })),
        }));

        setCities(formattedCities);
      } catch (error) {
        console.error("Error loading cities:", error);
        toast.error("Failed to load cities and districts");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      district: "",
      description: "",
      category: "",
      googleMapsUrl: "",
      googleMapsEmbedUrl: "",
      images: [],
      contactInfos: [],
    },
  });

  const contactInfos = form.watch("contactInfos");

  // Update form values when city/district selections change
  useEffect(() => {
    if (selectedCity) {
      form.setValue("city", selectedCity.label);
    }
  }, [selectedCity, form]);

  useEffect(() => {
    if (selectedDistrict) {
      form.setValue("district", selectedDistrict.label);
    }
  }, [selectedDistrict, form]);

  // Reset district when city changes
  useEffect(() => {
    setSelectedDistrict(null);
    form.setValue("district", "");
  }, [selectedCity, form]);

  const addContactInfo = () => {
    const currentContactInfos = form.getValues("contactInfos");
    form.setValue("contactInfos", [
      ...currentContactInfos,
      { type: "PHONE", value: "" },
    ]);
  };

  const removeContactInfo = (index: number) => {
    const currentContactInfos = form.getValues("contactInfos");
    form.setValue(
      "contactInfos",
      currentContactInfos.filter((_, i) => i !== index)
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const response = await fetch("/api/cafes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create cafe");
      }

      toast.success("Cafe created successfully");
      form.reset();
      setSelectedCity(null);
      setSelectedDistrict(null);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Add New Cafe</h1>

      <div className="">
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Cafe name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir kategori seçiniz." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Self Servis">Self Servis</SelectItem>
                        <SelectItem value="Butik">Butik</SelectItem>
                        <SelectItem value="Nostaljik">Nostaljik</SelectItem>
                        <SelectItem value="Kitap">Kitap</SelectItem>
                        <SelectItem value="Canlı Müzik">Canlı Müzik</SelectItem>
                        <SelectItem value="Sanat">Sanat</SelectItem>
                        <SelectItem value="Açık Hava">Açık Hava</SelectItem>
                        <SelectItem value="Vegan ve Sağlıklı Yaşam">
                          Vegan ve Sağlıklı Yaşam
                        </SelectItem>
                        <SelectItem value="Konsept">Konsept</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City Selector with React-Select */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <ReactSelect
                        placeholder="Select a city..."
                        options={cities}
                        value={selectedCity}
                        onChange={(selected: any) => {
                          setSelectedCity(selected);
                          field.onChange(selected ? selected.label : "");
                        }}
                        isLoading={loadingCities}
                        isSearchable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "40px",
                            boxShadow: "none",
                            border: "1px solid var(--border)",
                            "&:hover": {
                              borderColor: "var(--ring)",
                            },
                          }),
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* District Selector with React-Select */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <ReactSelect
                        placeholder="Select a district..."
                        options={selectedCity?.districts || []}
                        value={selectedDistrict}
                        onChange={(selected: any) => {
                          setSelectedDistrict(selected);
                          field.onChange(selected ? selected.label : "");
                        }}
                        isDisabled={!selectedCity}
                        isSearchable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "40px",
                            boxShadow: "none",
                            border: "1px solid var(--border)",
                            "&:hover": {
                              borderColor: "var(--ring)",
                            },
                          }),
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a description about the cafe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="googleMapsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://maps.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="googleMapsEmbedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Embed URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://maps.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContactInfo}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </div>

                {contactInfos.map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                  >
                    <FormField
                      control={form.control}
                      name={`contactInfos.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contact type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PHONE">Phone</SelectItem>
                              <SelectItem value="EMAIL">Email</SelectItem>
                              <SelectItem value="WEBSITE">Website</SelectItem>
                              <SelectItem value="INSTAGRAM">
                                Instagram
                              </SelectItem>
                              <SelectItem value="FACEBOOK">Facebook</SelectItem>
                              <SelectItem value="TWITTER">Twitter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`contactInfos.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Contact Value</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter contact information"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeContactInfo(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || []}
                        onChange={field.onChange}
                        onRemove={(url) => {
                          field.onChange(
                            field.value?.filter((current) => current !== url)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Creating..." : "Create Cafe"}
        </Button>
      </div>
    </div>
  );
}
