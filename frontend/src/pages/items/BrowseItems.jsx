import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import { CATEGORIES, ITEM_TYPES } from "../../config";
import { itemApi } from "../../services/api";

import ItemCard from "../../components/items/ItemCard";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

export default function BrowseItems() {
  // Filters user is currently editing
  const [filters, setFilters] = useState({
    itemName: "",
    type: "",
    category: "",
    location: "",
    sort: "latest",
    page: 1,
    limit: 6,
  });

  // Filters actually applied to the API
  const [appliedFilters, setAppliedFilters] = useState({
    itemName: "",
    type: "",
    category: "",
    location: "",
    sort: "latest",
    page: 1,
    limit: 6,
  });

  const [result, setResult] = useState({
    items: [],
    totalPage: 1,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Load items from backend
  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);

      try {
        const { data } = await itemApi.list(appliedFilters);

        if (!active) return;

        setResult({
          items: data.items || [],
          totalPage: data.totalPage || 1,
          totalItems: data.totalItems || 0,
        });
      } catch (error) {
        if (!active) return;

        setResult({
          items: [],
          totalPage: 1,
          totalItems: 0,
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  // Apply search and filters
  const search = (e) => {
    e.preventDefault();

    setFilters((current) => ({
      ...current,
      page: 1,
    }));

    setAppliedFilters({
      ...filters,
      page: 1,
    });

    setMobileFilters(false);
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (filters.page <= 1) return;

    const nextPage = filters.page - 1;

    setFilters((current) => ({
      ...current,
      page: nextPage,
    }));

    setAppliedFilters((current) => ({
      ...current,
      page: nextPage,
    }));
  };

  // Go to next page
  const goToNextPage = () => {
    if (filters.page >= result.totalPage) return;

    const nextPage = filters.page + 1;

    setFilters((current) => ({
      ...current,
      page: nextPage,
    }));

    setAppliedFilters((current) => ({
      ...current,
      page: nextPage,
    }));
  };

  return (
    <div className="page">
      <div className="container">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <div className="eyebrow">
              COMMUNITY REPORTS
            </div>

            <h1>
              Browse lost & found
            </h1>

            <p>
              Search reports and look for the details
              that match what you're missing.
            </p>
          </div>

          <Button
            variant="secondary"
            className="mobile-filter-btn"
            onClick={() =>
              setMobileFilters(!mobileFilters)
            }
          >
            <SlidersHorizontal size={17} />
            Filters
          </Button>
        </div>

        {/* Browse Layout */}
        <div className="browse-layout">

          {/* Filters */}
          <aside
            className={`filter-panel ${
              mobileFilters ? "filter-open" : ""
            }`}
          >
            <div className="filter-title">
              <Filter size={17} />
              Filters
            </div>

            <Input
              label="Search item"
              value={filters.itemName}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  itemName: e.target.value,
                }))
              }
              placeholder="Phone, wallet..."
            />

            <Input
              label="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  location: e.target.value,
                }))
              }
              placeholder="Dhanmondi..."
            />

            <Select
              label="Type"
              value={filters.type}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  type: e.target.value,
                  page: 1,
                }))
              }
              options={[
                {
                  value: "",
                  label: "All types",
                },
                ...ITEM_TYPES,
              ]}
            />

            <Select
              label="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  category: e.target.value,
                  page: 1,
                }))
              }
              options={[
                {
                  value: "",
                  label: "All categories",
                },
                ...CATEGORIES,
              ]}
            />

            <Select
              label="Sort"
              value={filters.sort}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  sort: e.target.value,
                  page: 1,
                }))
              }
              options={[
                {
                  value: "latest",
                  label: "Newest first",
                },
                {
                  value: "oldest",
                  label: "Oldest first",
                },
                {
                  value: "az",
                  label: "Name A–Z",
                },
                {
                  value: "za",
                  label: "Name Z–A",
                },
              ]}
            />

            <Button
              className="full"
              onClick={search}
            >
              <Search size={16} />
              Apply search
            </Button>
          </aside>

          {/* Results */}
          <section>

            {/* Results Bar */}
            <div className="results-bar">
              <span>
                <b>{result.totalItems}</b>{" "}
                {result.totalItems === 1
                  ? "report"
                  : "reports"}
              </span>
            </div>

            {/* Loading */}
            {loading ? (
              <Spinner label="Loading reports..." />
            ) : result.items.length === 0 ? (

              /* Empty */
              <EmptyState
                title="No matching reports"
                description="Try a different keyword, category, or location."
              />

            ) : (

              <>
                {/* Items */}
                <div className="items-grid">
                  {result.items.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {result.totalPage > 1 && (
                  <div className="pagination">

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={filters.page <= 1}
                      onClick={goToPreviousPage}
                    >
                      Previous
                    </button>

                    <span>
                      Page{" "}
                      <strong>{filters.page}</strong>{" "}
                      of{" "}
                      <strong>{result.totalPage}</strong>
                    </span>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={
                        filters.page >=
                        result.totalPage
                      }
                      onClick={goToNextPage}
                    >
                      Next
                    </button>

                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}