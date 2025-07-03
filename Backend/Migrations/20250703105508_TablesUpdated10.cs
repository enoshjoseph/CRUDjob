using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class TablesUpdated10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PositionCount = table.Column<int>(type: "integer", nullable: false),
                    MinQualification = table.Column<string>(type: "text", nullable: false),
                    MinExperience = table.Column<int>(type: "integer", nullable: false),
                    MinSalary = table.Column<string>(type: "text", nullable: false),
                    MaxSalary = table.Column<string>(type: "text", nullable: false),
                    RequesterName = table.Column<string>(type: "text", nullable: false),
                    DepartmentName = table.Column<string>(type: "text", nullable: false),
                    RequestDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobRequests", x => x.RequestId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobRequests");
        }
    }
}
