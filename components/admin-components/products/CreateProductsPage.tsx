"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import { FaTrash } from "react-icons/fa";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "color",
  "background",
  "list",
  "indent",
  "direction",
  "align",
  "link",
  "image",
  "video",
];

// Zod schema
const schema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category ID is required"),
  brand: z.string().min(1, "Brand ID is required"),
  supplier: z.string().min(1, "Supplier ID is required"),
  slug: z.string().min(1, "Slug is required"),
  stock: z.coerce.number().min(1, "Stock is required"),
  price: z.coerce.number().min(0.01, "Price is required"),
  salePrice: z.coerce.number().min(0.01, "Sale price is required"),
  shippingCost: z.coerce.number().min(0.01, "Shipping cost is required"),
  discount: z.coerce.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]),
});

type FormData = z.infer<typeof schema>;

export default function ModernProductForm() {
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      supplier: "",
      slug: "",
      stock: undefined,
      price: undefined,
      salePrice: undefined,
      shippingCost: undefined,
      discount: 0,
      status: "ACTIVE",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setSelectedImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const deleteImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    console.log("Errors:", errors);

    try {
      const base64Images = await Promise.all(
        selectedImages.map((file) => convertImageToBase64(file))
      );

      const fullData = {
        ...data,
        featured,
        newArrival,
        images: base64Images,
      };

      console.log("Submitting Product:", fullData);
    } catch (error) {
      console.error("Image conversion failed", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-full mx-auto bg-white shadow border"
    >
      <h4 className="text-base font-semibold bg-primary p-4 text-white rounded-t-lg">
        Create Product
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={watch("description")}
              onChange={(value) => setValue("description", value)}
              modules={modules}
              formats={formats}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["category", "brand", "supplier"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace("Id", " ID")}
                </label>
                <input
                  {...register(field as keyof FormData)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors[field as keyof FormData] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field as keyof FormData]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              {...register("slug")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-xl px-4 py-3"
            />
            <div className="flex gap-4 mt-4 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative group w-24 h-24 rounded overflow-hidden border"
                >
                  <img
                    src={src}
                    alt={`Preview ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => deleteImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-2 hidden group-hover:block"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { label: "Stock", name: "stock" },
            { label: "Price", name: "price" },
            { label: "Sale Price", name: "salePrice" },
            { label: "Shipping Cost", name: "shippingCost" },
            { label: "Discount (%)", name: "discount" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type="number"
                step="0.01"
                {...register(name as keyof FormData)}
                className="w-full border px-3 py-2 rounded-md"
              />
              {errors[name as keyof FormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[name as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}

          {[
            { label: "Featured Product", state: featured, setter: setFeatured },
            { label: "New Arrival", state: newArrival, setter: setNewArrival },
          ].map(({ label, state, setter }) => (
            <div
              key={label}
              className="flex items-center justify-between border px-3 py-2"
            >
              <label className="text-sm font-medium">{label}</label>
              <button
                type="button"
                onClick={() => setter(!state)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  state ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${
                    state ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("status")}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="OUT_OF_STOCK">Out Of Stock</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="text-right p-8">
        <button
          type="submit"
          className="bg-primary text-white px-7 py-3 font-medium rounded-md"
        >
          Save Product
        </button>
      </div>
    </form>
  );
}
